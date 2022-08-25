const mongoose=require('mongoose')

const customerSchema=new mongoose.Schema({
    c_id:{
        type:mongoose.Schema.Types.Number,
        required:true,
        unique:true
    },
    name:{
        type:mongoose.Schema.Types.String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true,
        validate:function(val){
            if(val.toString().length<10||val.toString().length>12){
                return false
            }
            return true
        }
    },
})

const Customer=mongoose.model('Customer',customerSchema)

module.exports=Customer