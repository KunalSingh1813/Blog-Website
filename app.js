//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const ObjectId = require("mongoose").Types.ObjectId;

const homeStartingContent = "“The life of every man is a diary in which he means to write one story, and writes another; and his humblest hour is when he compares the volume as it is with what he vowed to make it.” — J.M. Barrie Journaling can be a great pressure releasing valve when we feel overwhelmed or simply have a lot going on internally";
const aboutContent = "This is a blogging website/ Daily Journal website made while follwing Angela Yu's Web Development bootcamp as a part of Boss level Challenge for learning purpose ";
const contactContent = "You can contact me through email : singh.kunal1813@gmail.com ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

//Create a schema for the posts
const postSchema = {
  title: String,
  content: String
};

// Create a Post model (and 'posts' collection) 
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
 // Search database for blog posts
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  // Create a new 'Post' document from data from request body
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

 // Save new document to database; redirect to "/" GET if all well
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
 // Get the requested post's _id parameter from 'req.params'
const requestedPostId = req.params.postId;
// Search database for post with same _id
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      id: req.params.postId
    });
  });


});
app.post("/delete", function(req, res) {
  const deletedPostId = (req.body.deletebutton).trim();
  Post.findByIdAndDelete({_id: ObjectId(deletedPostId)}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted an item document");
      res.redirect("/");
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
