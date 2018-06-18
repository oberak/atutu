var express = require('express');
var router = express.Router();
var multer = require('multer');
var Campaign = require('../models/Campaign');
var upload = multer({
  dest: 'public/images/uploads'
});
var auth = function(req, res, next) {
  if (req.session.user){
    return next();
  } else
     res.redirect('/signup');
};
router.get('/add', auth, function (err,res,next) {
    res.render('campaign/campaign-add');
});



router.get('/list', function(req, res, next) {
  Campaign.find({},function (err,rtn) {
    if (err) throw err;
    res.render('campaign/campaign-list',{result: rtn});
    console.log(rtn);
  });

});

router.post('/add', upload.single('uploadImg'), function(req, res, next) {
  var campaign = new Campaign();
  campaign.title = req.body.campName;
  if (req.file) campaign.imgUrl = '/images/uploads/' + req.file.filename;
  campaign.brief = req.body.brief;
  campaign.story.text = req.body.text;
  campaign.story.html = req.body.contents;
  campaign.address.region = req.body.region;
  campaign.address.city = req.body.city;
  campaign.address.other = req.body.address;
  campaign.goal = req.body.goal;
  campaign.dueDate = req.body.endDate;
  campaign.tags = req.body.tags.split(",");
  campaign.status = "00";
  campaign.insertedBy = req.session.user.id;
  campaign.updatedBy = req.session.user._id;
  campaign.save(function(err, rtn) {
    if (err) throw err;
    res.json({
      status: true,
      msg: 'success',
      id: rtn._id
    });
  });
});

router.get('/view/:id', function (req,res,next) {
  Campaign.findOne({_id:req.params.id},function (err,rtn) {
    if(err) throw err;
    if(rtn){
      res.render('campaign/campaign-confirm',{camp:rtn});
    }else{
      throw new Error('Data not found!');
    }
  });
});

router.post('/view/:id', function(req, res, next) {
  Campaign.findOne({_id:req.params.id}, function(err, user) {
    if(err) res.json(500, {'err': err.message});
    else res.json({ users: user});
  });
});

router.get('/modify/:id', function(req, res, next) {
  Campaign.findOne({_id:req.params.id}, function(err, rtn) {
    if(err) throw err;
    if (rtn) {
      res.render('campaign/campaign-modify', {camp:rtn});
    }else{
      throw new Error('Data not found!');
    }
  });
});

router.post('/modify', upload.single('uploadImg'), function(req, res, next) {
    var update = {
    title : req.body.campName,
    imgUrl : '/images/uploads/' + req.file.filename,
    brief : req.body.brief,
    story_text : req.body.text,
    story_html : req.body.contents,
    address_region : req.body.region,
    address_city : req.body.city,
    address_other : req.body.address,
    goal : req.body.goal,
    dueDate : req.body.endDate,
    tags : req.body.tags,
    updated: new Date()
  };
    Campaign.findByIdAndUpdate(req.body.cam_id, {$set: update}, function(err, campaign) {
      if(err) throw (err);
      res.json({
        status: true,
        msg: 'success',
        id: campaign._id
      });
    });
  });

router.get('/detail/:id', function (req,res,next) {
  Campaign.findById({_id:req.params.id},function (err,rtn) {
    if(err) throw err;
    console.log(rtn);
    if(rtn)
    res.render('campaign/campaign-detail',{camp:rtn});
  });
});

router.post('/detail', upload.single('uploadImg'), function(req, res, next) {
  var campaign = new Campaign();
    campaign.title = req.body.campName;
    if (req.file) campaign.imgUrl = '/images/uploads/' + req.file.filename;
    campaign.brief = req.body.brief;
    campaign.story.text = req.body.text;
    campaign.story.html = req.body.contents;
    campaign.address.region = req.body.region;
    campaign.address.city = req.body.city;
    campaign.address.other = req.body.address;
    campaign.goal = req.body.goal;
    campaign.dueDate = req.body.endDate;
    campaign.tags = req.body.tags;
    campaign.status = "00";

    campaign.save(function(err, rtn) {
      if(err) throw err;
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  });


router.get('/delete/:id', function(req, res, next){
  Campaign.findByIdAndRemove(req.params.id, function(err, campaign){
    if(err) throw err;
    res.redirect('/campaign/list');
  });
});


module.exports = router;
