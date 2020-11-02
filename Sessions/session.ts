const express = require('express')
const app = express()
const port = 5000
const axios = require('axios');
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.json()); 

app.post('/token', urlencodedParser, async (req: any, res: any, next: any) => {

    let userId :string, passId : string

    try{
      userId = req.body.userId
      passId = req.body.passId
    }
    catch{
      return res.statusCode(400).send("Bad request: userId or passId malformated")
    }

    let response = await axios.get('http://accounts:3000/login', {
      headers: {
        'Authorization' :  `Basic ${ Buffer.from(`${ `${userId}:${passId}`}`) .toString("base64")}`
      }
    }).catch((err: any) => {

      if(err.response){
         return res.status(err.response.status).send(err.response.data)
      }
       return res.status(401).send("An unknown error has occured")

    })

    if(response.status != 200)
      return

    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_KEY_EXPIRY,
      })

      console.log("token:", token)
    
      return res.send(token)

    }
)

app.post('/verify', urlencodedParser, async (req: any, res: any, next: any) => {

  let token :string

    try{
      token = req.body.token
    }
    catch{
      return res.statusCode(400).send("Bad request: token malformated")
    }


  jwt.verify(token, process.env.JWT_KEY, function(err: any, decoded: any) {

    if(err){
      console.log(err)
      res.status(401).send("Invalid token")
    }
    else
      res.send()
  })

})


app.listen(port, () => {
  console.log(`Sessions listening at http://0.0.0.0:${port}`)
})