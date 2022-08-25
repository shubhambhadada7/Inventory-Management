const express = require("express");
const Router = new express.Router();
const Customer=require("../model/customer")
const PurchaseOrder = require("../model/purchaseOrder");
const Stock = require("../model/stock");
const SellingOrder=require('../model/SellingOrder')

Router.get("/sellingOrder", async (req, res) => {
  
  try {
    var myPreviousOrders=await SellingOrder.find({}).populate('customer').populate('product')
    res.send({ myPreviousOrders });
  } catch (e) {
    console.log(e)
    res.status(404).send({ error: "some error occured" });
  }
});

Router.post("/sellingOrder", async (req, res) => {
  try {
    const {  c_id, date, total, list,discount } = req.body;
    //console.log(req.body);
    if (!c_id || !date || total === 0 || list.length == 0) {
      throw new Error("Enter details properly");
    }
    var bill_no = 1;
    var count = await SellingOrder.collection.countDocuments();
    if (count !== 0) {
      const prevPurchases = await SellingOrder.find({})
        .sort({ bill_no: -1 })
        .limit(1);
      bill_no = 1 + prevPurchases[0].bill_no;
    }
    const sell = new SellingOrder({  c_id, date, total, list,  bill_no,discount });

    for(let i=0;i<list.length;i++){
      var item=list[i]
      var prevStock=await Stock.findOne({p_id:item.p_id})
        prevStock.quantity-=item.quantity
        if(prevStock.quantity>0){
            await prevStock.save()
        }
        else{
            await Stock.findByIdAndDelete(prevStock._id)
        }
    }

    await sell.save();
    
    
    // console.log(purchase);
    res.send({  sell });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "some error occured" });
  }
});


Router.get("/sellingOrder/prerequisite", async (req, res) => {
  try {
    const customerList = await Customer.find({});
    const productList = await Stock.find({}).populate('product');
    res.send({ customerList, productList });
  } catch (e) {
    res.status(404).send({ error: "some error occured" });
  }
});

Router.delete("/sellingOrder", async (req, res) =>{
  try{
    const { bill_no}=req.body
    if(!bill_no){
      throw new Error('bill_no is missing');
  }
  
  const exist=await SellingOrder.findOneAndDelete({ bill_no})
  if(!exist){
      return res.status(406).send({error:'Selling Order does not exist'})
  }
  res.status(201).send({ msg: 'Selling Order Deleted successfully', bill_no })
  }
  catch(e){
    console.log(e)
    res.status(404).send({ error: "some error occured" });
  }
})
module.exports = Router;
