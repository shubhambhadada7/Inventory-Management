const mongoose=require('mongoose')

const sellingOrderSchema=new mongoose.Schema({
    bill_no:{
        type:mongoose.Schema.Types.Number,
        required:true,
        unique:true
    },
    date:{
        type:mongoose.Schema.Types.Date,
        default:new Date(),
    },
    c_id:{
        type:mongoose.Schema.Types.Number,
        ref:'Customer'
    },
    discount:{
        type:mongoose.Schema.Types.Number,
        validate:function(val){
            if(val<0 || val>this.total){
                return false
            }
            return true
        }
    },
    total:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    list:[{
        p_id:{
            type:mongoose.Schema.Types.Number,
            ref:'Product',
            required:true
        },
        selling_price:{
            type:mongoose.Schema.Types.Number,
            ref:'Stock',
            required:true
        },
        quantity:{
            type:mongoose.Schema.Types.Number,
            default:1,
        },
        cost:{
            type:mongoose.Schema.Types.Number,
            validate:function(val){
                if(val!=this.quantity*this.selling_price)
                    return false
                return true
            }
        }
    }
    ]

}, {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
  })


sellingOrderSchema.virtual('customer',{
    ref: 'Customer',
    localField:'c_id',
    foreignField:'c_id'
})

sellingOrderSchema.virtual('product',{
    ref: 'Product',
    localField:'list.p_id',
    foreignField:'p_id'
})
const SellingOrder=mongoose.model('SellingOrder',sellingOrderSchema)

module.exports=SellingOrder