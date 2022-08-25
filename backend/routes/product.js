const express = require('express')
const Router = new express.Router()
const Product=require('../model/product')

Router.get('/product',async(req,res)=>{
    try{
        const myProducts=await Product.find({}).sort({p_id:1})
        res.status(200).send({myProduct: myProducts})
    }
    catch(e){
        res.status(404).send({ error: "some error occured" })
    }
})

Router.post('/product', async(req, res) => {

    const { name, description,unit,default_unit } = req.body

    try {
        if (!name || !description || !unit || !default_unit) {
            throw new Error('Enter details properly');
        }
        
        var count=await Product.collection.countDocuments()
        var p_id=1;
        if(count!==0){
            const prevProduct=await Product.find({}).sort({p_id:-1}).limit(1);
           p_id=1+prevProduct[0].p_id
        }
        //console.log(p_id)
        const product=new Product({ p_id,name,description,unit,default_unit  })
        await product.save()
        res.status(201).send({ msg: 'product registered successfully',p_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "registration failed" })
    }

})

Router.patch('/product', async(req, res) => {
    const { name, description,unit,default_unit,p_id } = req.body

    try {
        if(!p_id){
            throw new Error('p_id is missing');
        }
        if (!name || !description || !unit || !default_unit) {
            throw new Error('Enter details properly');
        }
        const exist=await Product.findOne({p_id})
        if(!exist){
            return res.status(406).send({error:'Product does not exist'})
        }
        
        exist.name=name;
        exist.description=description;
        exist.unit=unit;
        exist.default_unit=default_unit;
        
        await exist.save()
        res.status(201).send({ msg: 'product Updated successfully',p_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "updation failed" })
    }

})


Router.delete('/product', async(req, res) => {
    const { p_id } = req.body

    try {
        if(!p_id){
            throw new Error('p_id is missing');
        }
        
        const exist=await Product.findOneAndDelete({p_id})
        if(!exist){
            return res.status(406).send({error:'Product does not exist'})
        }
        res.status(201).send({ msg: 'product Deleted successfully',p_id })
    }
    catch (e) {
        console.log(e)
        res.status(406).send({ error: "updation failed" })
    }

})


module.exports=Router