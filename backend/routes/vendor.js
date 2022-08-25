const express = require('express')
const Router = new express.Router()
const Vendor=require('../model/vendor')

Router.get('/vendor',async(req,res)=>{
    try{
        const myVendor=await Vendor.find({}).sort({v_id:1})
        res.status(200).send({myVendor})
    }
    catch(e){
        res.status(404).send({ error: "some error occured" })
    }
})

Router.post('/vendor', async(req, res) => {

    const { name, mobile, address, gst } = req.body

    try {
        if (!name || !mobile || !address || !gst) {
            throw new Error('Enter details properly');
        }
        const exist=await Vendor.findOne({mobile})
        if(exist){
            return res.status(406).send({error:'Vendor already registered with this mobile'})
        }
        var count=await Vendor.collection.countDocuments()
        var v_id=1;
        if(count!==0){
            const prevVendor=await Vendor.find({}).sort({v_id:-1}).limit(1);
           v_id=1+prevVendor[0].v_id
        }
        //console.log(v_id)
        const vendor=new Vendor({ v_id,name, mobile, address, gst })
        await vendor.save()
        res.status(201).send({ msg: 'vendor registered successfully',v_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "registration failed" })
    }

})

Router.patch('/vendor', async(req, res) => {
    const { name, mobile, address, gst,v_id } = req.body

    try {
        if(!v_id){
            throw new Error('v_id is missing');
        }
        if (!name || !mobile || !address || !gst ) {
            throw new Error('Enter details properly');
        }
        const exist=await Vendor.findOne({v_id})
        if(!exist){
            return res.status(406).send({error:'Vendor does not exist'})
        }
        
        exist.name=name;
        exist.mobile=mobile;
        exist.gst=gst;
        exist.address=address;
        
        await exist.save()
        res.status(201).send({ msg: 'vendor Updated successfully',v_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "updation failed" })
    }

})


Router.delete('/vendor', async(req, res) => {
    const { v_id } = req.body

    try {
        if(!v_id){
            throw new Error('v_id is missing');
        }
        
        const exist=await Vendor.findOneAndDelete({v_id})
        if(!exist){
            return res.status(406).send({error:'Vendor does not exist'})
        }
        res.status(201).send({ msg: 'vendor Deleted successfully',v_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "updation failed" })
    }

})


module.exports=Router