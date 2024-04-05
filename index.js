const express = require('express');
const connectToMongo = require('./Db');
connectToMongo();
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;
const category1 = require('./Schema/category1Schema');
const category2 = require('./Schema/category2Schema')
var cors = require('cors');
app.use(cors());
app.use(express.json())


io.on('connection', (socket) => {
    console.log("A user connected")
    
    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})

app.post('/register', async (req, res) => {

try {
    let {name, number} = req.body;
    const newUser = await category2.create({name, number})
    const activeUser = await category1.findOne({status: 'active'});
    if(!activeUser){
       return res.status(404).json({message:"No active user"})
    }
    console.log(`New user ${newUser.name} connected to activeUser ${activeUser.name}`)
    io.emit('newUser', newUser);
    res.status(201).json(newUser)
        
    }catch(error){
        console.error("There is some error conncting", error);
        res.status(500).json({message: "Internal error occurred"})
    }

})









app.listen(PORT, () => {
    console.log(`App is listening to the port, ${PORT}`)
})