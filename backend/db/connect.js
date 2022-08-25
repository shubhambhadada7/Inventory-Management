const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
}).then(() => {
    console.log('database is connected now')
})
    .catch((e) => {
        console.log(e)
    })