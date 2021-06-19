//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");


const app = express();
let newItems = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day=today.toLocaleDateString("en-US",options);

  res.render("list", {
    today: day,newListItems:newItems
  });
});
app.post("/",function(req,res){
  let newItem= req.body.newItem;
  newItems.push(newItem);
  //console.log(newItem);
  res.redirect("/");
});



app.listen(3000, function() {
  console.log("Up and Running!");
});
