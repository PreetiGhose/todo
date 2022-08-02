const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();

mongoose.connect("mongodb://localhost:27017/newlistDB", {
  useNewUrlParser: true,
});

const ListSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ListSchema);
const item = new Item({ name: "Zildjian" });
item.save().then(() => console.log("done"));

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
