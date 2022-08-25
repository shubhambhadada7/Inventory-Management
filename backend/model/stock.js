const mongoose=require('mongoose')

const stockSchema=new mongoose.Schema({
    p_id:{
        type:mongoose.Schema.Types.Number,
        required:true,
        ref:'Product'
    },
    buying_price:{
        type:mongoose.Schema.Types.Number,
        required:true,
        ref:'PurchaseOrder'
    },
    selling_price:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    quantity:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    v_id:{
        type:mongoose.Schema.Types.Number,
        required:true,
        ref:'Vendor'
    },
    pod_id:{
        type:Number,
        required:true,
        ref:'PurchaseOrder'
    }
}, {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
  })
stockSchema.virtual('vendor',{
    ref: 'Vendor',
    localField:'v_id',
    foreignField:'v_id'
})

stockSchema.virtual('product',{
    ref: 'Product',
    localField:'p_id',
    foreignField:'p_id'
})
const Stock=mongoose.model('Stock',stockSchema)

module.exports=Stock