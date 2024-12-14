
const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
    next();
})

const authMiddleware = (req,res,next)=> {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({msg: ["unauthorized", "access token is required"] });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(400).json({msg: "Invalid token!"});
    }
}

//mern authentication with JWT Tokens

const generateToken = (payload) => {
return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
}

app.get('/', (req,res)=> {
    res.status(201).json({msg: "Hello from the server side"})
})


app.post('/api/login', (req,res)=>{
    const {email, password} = req.body;

    try {

        if(email === 'test@example.com' && password === 'password'){
            const payload = {
                id: 1,
                role: "admin",
                name: 'Bidhan Khatri'
            }
            const token = generateToken(payload)
            return res.status(200).json({access: token, msg:"Login successful"});
        }else{
            return res.status(401).json({msg: "Invalid credintals!"});
        }
        
    } catch (error) {
        return res.status(500).json({msg:"Internal server error"})
    }
})

//route to get the users details
app.get('/api/userdata', authMiddleware, (req,res)=>{
    return res.status(200).json({msg:"payload data", data: req.user});
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
})