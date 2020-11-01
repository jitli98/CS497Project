const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/token', urlencodedParser, async (req, res) => {


    
    let userId, passId
    
    try{
      userId = req.body.userId
      passId = req.body.passId
    }
    catch{
      res.statusCode = 400
      res.send("Bad request: userId or passId malformated")
    }

    let response = await axios.get('accounts:3000/login', 
    {
      headers: {
        'Authorization' : {
          'username' : userId,
          'password' : passId
        }
      }
    })

    if(response.status != 200){
      res.statusCode = response.status
      res.send(response)
    }
    else{


    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_KEY_EXPIRY,
      })

      console.log("token:", token)
    
      // set the cookie as the token string, with a similar max age as the token
      // here, the max age is in milliseconds, so we multiply by 1000
      res.cookie("token", token, { maxAge: parseInt(process.env.JWT_KEY_EXPIRY) * 1000 })
      res.send(token)
      res.end()

    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})