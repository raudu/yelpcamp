var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//Root Route
router.get("/", function(req,res){
  res.render("landing");
});

// AUTH ROUTES
//SHOW REGISTER form
router.get("/register", function(req, res){
  res.render("register");
});

// THIS ROUTE WILL HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      /*
      https://www.udemy.com/the-web-developer-bootcamp/learn/v4/questions/1700812
      Note about Flash Messages Section 36, Lecture 324
      Where there is a bug and a user has to click the register button twice to see the flash message
      */
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
  res.render("login");
});

//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }), function(req, res){
      // we can get rid of the call back if we wanted to.
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
  req.logout();
  res.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});


module.exports = router;
