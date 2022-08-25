const mongoose=require('mongoose')

const PurchaseOrderSchema=new mongoose.Schema({
    pod_id:{
        type:mongoose.Schema.Types.Number,
        required:true,
        unique:true
    },
    v_id:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    date:{
        type:mongoose.Schema.Types.Date,
        required:true,
        default:new Date()
    },
    total:{
        type:mongoose.Schema.Types.Number,
        required:true,
    },
    list:[{
        p_id:{
            type:mongoose.Schema.Types.Number,
            ref:'Product',
            required:true
        },
        buying_price:{
            type:mongoose.Schema.Types.Number,
            required:true

        },
        quantity:{
            type:mongoose.Schema.Types.Number,
            required:true

        },
        selling_price:{
            type:mongoose.Schema.Types.Number,
            default:this.buying_price
        }
    }]

}, {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
  })

PurchaseOrderSchema.virtual('vendor',{
    ref: 'Vendor',
    localField:'v_id',
    foreignField:'v_id'
})

PurchaseOrderSchema.virtual('product',{
    ref: 'Product',
    localField:'list.p_id',
    foreignField:'p_id'
})
const PurchaseOrder=mongoose.model('PurchaseOrder',PurchaseOrderSchema)

module.exports=PurchaseOrder