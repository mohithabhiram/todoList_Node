//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
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
const listSchema = {
  name : String,
  items : [newItemsSchema]
};
const List = mongoose.model("List",listSchema);
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
app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        //create new list
        const list=new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }else{
        //show existinng list
        res.render("list", {
          listTitle:foundList.name,newListItems: foundList.items
        });
      }
    }
  });


});
app.post("/",function(req,res){
  const itemName = req.body.newItem;
  const listName = req.body.list;//Here list is the name for button + in list.ejs
  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
  //console.log(req.body);
});
app.post("/delete",function(req,res){
  const checkedId=req.body.checkbox;
  Item.findByIdAndRemove(checkedId,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Deleted Selected Item");
    }
    res.redirect("/");
  });
});
app.get("/work",function(req,res){
  res.render("list",{
    listTitle:"Work List",
    newListItems:workItems
  });
});

app.get("/about",function(req,res){
  res.render("about");
})



app.listen(3000, function() {
  console.log("Up and Running!");
});
