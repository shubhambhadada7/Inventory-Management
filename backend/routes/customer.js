const express = require('express')
const Router = new express.Router()
const Customer=require('../model/customer')

Router.get('/customer',async(req,res)=>{
    try{
        const myCustomer=await Customer.find({}).sort({c_id:1})
        res.status(200).send({myCustomer: myCustomer})
    }
    catch(e){
        res.status(404).send({ error: "some error occured" })
    }
})

Router.post('/customer', async(req, res) => {

    const { name, mobile } = req.body

    try {
        if (!name || !mobile ) {
            throw new Error('Enter details properly');
        }
        const exist=await Customer.findOne({mobile})
        if(exist){
            return res.status(406).send({error:'Customer already registered with this mobile'})
        }
        var count=await Customer.collection.countDocuments()
        var c_id=1;
        if(count!==0){
            const prevCustomer=await Customer.find({}).sort({c_id:-1}).limit(1);
           c_id=1+prevCustomer[0].c_id
        }
        //console.log(c_id)
        const customer=new Customer({ c_id,name, mobile })
        await customer.save()
        res.status(201).send({ msg: 'customer registered successfully',c_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "registration failed" })
    }

})

Router.patch('/customer', async(req, res) => {
    const { name, mobile,c_id } = req.body

    try {
        if(!c_id){
            throw new Error('c_id is missing');
        }
        if (!name || !mobile ) {
            throw new Error('Enter details properly');
        }
        const exist=await Customer.findOne({c_id})
        if(!exist){
            return res.status(406).send({error:'Customer does not exist'})
        }
        
        exist.name=name;
        exist.mobile=mobile;
        
        await exist.save()
        res.status(201).send({ msg: 'customer Updated successfully',c_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "updation failed" })
    }

})


Router.delete('/customer', async(req, res) => {
    const { c_id } = req.body
    try {
        if(!c_id){
            throw new Error('c_id is missing');
        }
        
        const exist=await Customer.findOneAndDelete({c_id})
        if(!exist){
            return res.status(406).send({error:'customer does not exist'})
        }
        res.status(201).send({ msg: 'Customer Deleted successfully',c_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "deletion failed" })
    }

})


module.exports=Router