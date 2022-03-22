//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/toDoListDB");
}

const newItemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", newItemsSchema);

const item1 = new Item({ name: "Go Shopping!" });

const item2 = new Item({ name: "Study for an hour!" });

const item3 = new Item({ name: "Give water to plants!" });

const defaultitems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  item: [newItemsSchema],
});

const List = mongoose.model("list", listSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Item.find({}, function (err, item) {
    if (err) {
      console.log(err);
    } else if (item.length === 0) {
      Item.insertMany(defaultitems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Sucessfully addedd the items!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: item });
    }
  });
});

app.post("/delete", function (req, res) {
  const deletedItem = req.body.checkbox;
  console.log(deletedItem);

  Item.findOneAndDelete({ _id: deletedItem }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("sucessfully deleted");
      res.redirect("/");
    }
  });
});

app.post("/", function (req, res) {
  const newitem = req.body.newItem;

  const newListTitle = req.body.list;

  console.log("newListTitle: ", newListTitle);

  if (newListTitle === "Today") {
    const item4 = new Item({ name: newitem });

    item4.save();
    res.redirect("/");
  } else {
    List.findOne({ name: newListTitle }, function (err, defaultList) {
      defaultList.item.push(newitem);
      defaultList.save();
      res.redirect("/" + newListTitle);
    });
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/:new", (req, res) => {
  const newitem1 = req.params.new;

  List.findOne({ name: newitem1 }, function (err, defaultItem) {
    if (!err) {
      if (!defaultItem) {
        const newitem2 = new List({
          name: newitem1,
          item: defaultitems,
        });
        newitem2.save();
        res.redirect("/" + newitem1);
      } else {
        res.render("list", {
          listTitle: defaultItem.name,
          newListItems: defaultItem.item,
        });
      }
    } else {
      console.log(err);
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
