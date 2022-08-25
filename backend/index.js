const express = require('express')
const bodyParser = require('body-parser');

require('dotenv').config({ path: 'config.env' })

require('./db/connect.js')
const app = express()
app.use(express.json())
//app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

//routes
const vendorRoutes=require('./routes/vendor')
const customerRoutes=require('./routes/customer')
const productRoutes=require('./routes/product')
const purchaseOrderRoutes=require('./routes/purchaseOrder')
const stockRoutes=require('./routes/stock')
const sellingRoute=require('./routes/sellingOrder')

app.use(vendorRoutes)
app.use(customerRoutes)
app.use(productRoutes)
app.use(purchaseOrderRoutes)
app.use(stockRoutes)
app.use(sellingRoute)

app.listen(process.env.PORT || 5000, () => {
    console.log('app is running on 5000')
})