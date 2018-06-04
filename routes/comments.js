var express = require("express"),
router  = express.Router({mergeParams: true}),
Campground = require("../models/campground"),
Comment = require("../models/comment")
middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){

  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }
    else {
      res.render("comments/new", {campground : campground});
    }
  });

});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err)
        }
        else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //then save comment
          comment.save();
          //push comment to campround comments and save
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added a comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });

    }
  });

});

/*
Campround edit route /campgrounds/:id/edit
Comment edit route /campgrounds/:id/comments/:comment_id/edit
*/

// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "No Campground found");
      res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        req.flash("error", "No comment found");
        res.redirect("back");
      }
      else {
        res.render("comments/edit", { campground_id : req.params.id, comment : foundComment});
      }

    });
  });
});

// Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err || !updatedComment){
      req.flash("error", "Cannot find that Comment");
      res.redirect("back");
    }
    else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }
    else {
      req.flash("successs", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
