//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true});
//Schema Creation
const newItemsSchema = {
  name: String
};
//Model Creation
const Item = mongoose.model("Item",newItemsSchema);
const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});
const defaultItems = [item1,item2,item3];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved default items to database");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {
        listTitle:"Today",newListItems: foundItems
      });
    }
  });
});
app.post("/",function(req,res){
  let newItem= req.body.newItem;
  if(req.body.list === "Work List")
  {
    workItems.push(newItem);
    res.redirect("/work");
  }
  else{
    newItems.push(newItem);
    res.redirect("/");
  }
  //console.log(req.body);
});
app.get("/work",function(req,res){
  res.render("list",{
    listTitle:"Work List",
    newListItems:workItems
  });
});
app.post("/work",function(req,res){
  let workItem=req.body.newItem;
  workItems.push(workItem);
  res.redirect("/work");
});
app.get("/about",function(req,res){
  res.render("about");
})



app.listen(3000, function() {
  console.log("Up and Running!");
});
