const express = require("express");
const Router = new express.Router();
const Product = require("../model/product");
const Vendor = require("../model/vendor");
const Stock = require("../model/stock");


Router.get("/stock", async (req, res) => {
  
  try {
    var stock=await Stock.find({}).populate('vendor').populate('product')
    res.send({ stock });
  } catch (e) {
    console.log(e)
    res.status(404).send({ error: "some error occured" });
  }
});


module.exports = Router;
