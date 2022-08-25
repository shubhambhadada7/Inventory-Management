const mongoose=require('mongoose')

const vendorSchema= new mongoose.Schema({
    v_id:{
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
    address:{
        type:String,

    },
    gst:{
        type:String
    }
})


const Vendor=mongoose.model('Vendor',vendorSchema)

module.exports=Vendor