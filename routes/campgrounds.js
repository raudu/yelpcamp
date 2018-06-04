var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//INDEX Show all Campgrounds Route
router.get("/", function(req,res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err);
    }
    else {
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

//Create Route - Adds new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
  //get data from form and and to campgrounds array

  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  console.log(req.user);
  var author = {
    id : req.user._id,
    username : req.user.username
  };
  var campground = {
    name : name,
    price : price,
    image_url : image,
    description : description,
    author : author
  }
  Campground.create(campground, function(err, newlyCreated){
    if(err){
      console.log("There was an error while attempting to save the campground collection. It was not saved!!");
    }
    else {
      console.log("A new campground collection has been created");
      console.log(newlyCreated);
      res.redirect("campgrounds");
    }
  });
  //redirect back to campgrounds page
  //campgrounds.push(newCampground);
});

//New Route - displays form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});


//  SHOW ROUTE - show more info about one campground
router.get("/:id", function(req,res){
  //console.log("THIS WILL BE THE SHOW PAGE SOME DAY!!");
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err || !foundCampground){
      console.log(err);
      req.flash("error", "Campground not found");
      res.redirect("back");
    }
    else {
      res.render("campgrounds/show", {campground : foundCampground});
    }
  });
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
          res.render("campgrounds/edit", { campground : foundCampground });
    });
});


//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
    if(err){
      res.redirect("/campgrounds");
    }
    else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
  //redirect somewhere (usually show page)

});

//Destroy campground routes]
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }
    else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
