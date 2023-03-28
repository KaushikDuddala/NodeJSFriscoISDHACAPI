import express from 'express'
const app = express()
import { getSchedule } from "./endpoints/schedule.js"

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', function(req, res) {
  res.send('{\'message\':\'Welcome to the HAC API\'}')
})
app.post('/schedule', async function(req, res) {
  let user
  let pass
  try{
    user = req.body.username
    pass = req.body.password
  }catch(error){
    res.send(`{"error":"${error}"}`)
    res.status(400)
    res.end()
  }
  try {
    const response = await getSchedule(user, pass)
    res.send(response)
    res.status(200)
    res.end()
  } catch (error) {
    res.send(`{'error':"${error}"`)
    res.status(401)
    res.end()
  }
})

app.listen(8080)