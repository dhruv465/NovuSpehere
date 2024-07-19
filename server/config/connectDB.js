const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on('connected', ()=>{
            console.log("Database connected successfully")
        
        })

        connection.on('error',(error)=>{
            console.log("Something is wrong with the mongo db",error)
        })
    } catch (error) {
        console.log("Database connection failed",error)
    }
}

module.exports = connectDB