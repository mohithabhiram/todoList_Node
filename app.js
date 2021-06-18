//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");


const app = express();
var newItem = "";
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day=today.toLocaleDateString("en-US",options);

  res.render("list", {
    lol: day,newListItem:newItem
  });
});
app.post("/",function(req,res){
  newItem= req.body.newItem;
  //console.log(newItem);
  res.redirect("/");
});



app.listen(3000, function() {
  console.log("Up and Running!");
});