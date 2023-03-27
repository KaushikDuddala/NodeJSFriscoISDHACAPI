import express from 'express'
const app = express()
import { getSchedule } from "./endpoints/schedule.js"

app.get('/', function(req, res) {
  res.send('{\'message\':\'Welcome to the HAC API\'')
})
app.get('/schedule', async function(req, res) {
  let user = req.body.username
  let password = req.body.password
  try {
    const response = await getSchedule(user, password)
    res.send(response)
    res.status(200)
    res.end()
  } catch (error) {
    res.send(`{'error':${error}`)
    res.status(401)
    res.end()
  }

})

app.listen(8080)