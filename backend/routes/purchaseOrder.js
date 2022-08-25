const express = require("express");
const Router = new express.Router();
const Product = require("../model/product");
const Vendor = require("../model/vendor");
const PurchaseOrder = require("../model/purchaseOrder");
const Stock = require("../model/stock");


Router.get("/purchaseorder", async (req, res) => {
  
  try {
    var myPreviousOrders=await PurchaseOrder.find({}).populate('vendor').populate('product')
    // myPreviousOrders=await myPreviousOrders
    res.send({ myPreviousOrders });
  } catch (e) {
    console.log(e)
    res.status(404).send({ error: "some error occured" });
  }
});

Router.post("/purchaseorder", async (req, res) => {
  try {
    const { v_id, date, total, list } = req.body;
    //console.log(req.body);
    if (!v_id || !date || total === 0 || list.length == 0) {
      throw new Error("Enter details properly");
    }
    var pod_id = 1;
    var count = await PurchaseOrder.collection.countDocuments();
    if (count !== 0) {
      const prevPurchases = await PurchaseOrder.find({})
        .sort({ pod_id: -1 })
        .limit(1);
      pod_id = 1 + prevPurchases[0].pod_id;
    }
    const purchase = new PurchaseOrder({ v_id, date, total, list, pod_id });
    
    var stock = [];
    for(let i=0;i<list.length;i++){
      var item=list[i]
      var prevStock=await Stock.findOne({p_id:item.p_id})
    
      if(prevStock){
        prevStock.buying_price=((prevStock.buying_price*prevStock.quantity)+(item.buying_price*item.quantity))/(prevStock.quantity+item.quantity);
        prevStock.selling_price=item.selling_price
        prevStock.quantity+=item.quantity
        prevStock.v_id = v_id;
        prevStock.pod_id = pod_id;
        await prevStock.save()
      }
      else{
        item.v_id = v_id;
        item.pod_id = pod_id;
        stock = stock.concat(item);
      }
      
    }

    await purchase.save();
    const reply = await Stock.insertMany(stock);
    
    // console.log(purchase);
    res.send({ purchase });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "some error occured" });
  }
});


Router.get("/purchaseorder/prerequisite", async (req, res) => {
  try {
    const vendorList = await Vendor.find({});
    const productList = await Product.find({});
    res.send({ vendorList, productList });
  } catch (e) {
    res.status(404).send({ error: "some error occured" });
  }
});

Router.delete("/purchaseorder", async (req, res) =>{
  try{
    const {pod_id}=req.body
    if(!pod_id){
      throw new Error('pod_id is missing');
  }
  
  const exist=await PurchaseOrder.findOneAndDelete({pod_id})
  if(!exist){
      return res.status(406).send({error:'Product Order does not exist'})
  }
  res.status(201).send({ msg: 'product Order Deleted successfully',pod_id })
  }
  catch(e){
    console.log(e)
    res.status(404).send({ error: "some error occured" });
  }
})
module.exports = Router;
