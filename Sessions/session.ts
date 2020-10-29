const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/token', urlencodedParser, async (req, res) => {

    const userId = req.body.userId
    const passId = req.body.passId

    // let response = await axios.post('/login', {
    //     'userId': userId,
    //     'passId': passId
    // })

    // if(response.status != 200){
      // res.statusCode = response.status
      // res.send('Something has gone wrong!')
    // }
    // else{


    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_KEY_EXPIRY,
      })
      console.log("token:", token)
    
      // set the cookie as the token string, with a similar max age as the token
      // here, the max age is in milliseconds, so we multiply by 1000
      res.cookie("token", token, { maxAge: parseInt(process.env.JWT_KEY_EXPIRY) * 1000 })
      res.end()

    // }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})