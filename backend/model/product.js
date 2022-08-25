const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    p_id:{
        type:mongoose.Schema.Types.Number,
        required:true,
        unique:true
    },
    name:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    default_unit:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    unit:{
        type:mongoose.Schema.Types.Boolean,
        default:true
    },
    description:{
        type:mongoose.Schema.Types.String
    }
})

const Product= mongoose.model('Product',productSchema)

module.exports=Product