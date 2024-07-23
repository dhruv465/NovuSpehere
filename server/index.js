const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const { app, server } = require('./socket/index')

// const app = express()
app.use(cors({
    origin: 'https://novuspehere.onrender.com',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 8080

//default route
app.get('/', (request, response) => {
    response.json({
        message: "Server is running on port" + PORT
    })
})

//API endpoint

app.use('/api', router)


//connect to database and start server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)

    })
})


module.exports = app;