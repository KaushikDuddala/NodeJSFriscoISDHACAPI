import express from 'express'
const app = express()
import { getSchedule } from "./endpoints/schedule.js"
import { getStudentInfo } from "./endpoints/studentinfo.js"
import { getClasses } from './endpoints/classes.js'

app.use(express.json())
app.use(express.urlencoded({extended: true}))


async function validateUserAndPass(reqBody){
  let user
  let pass
  try{
    user = reqBody.username
    pass = reqBody.password
  }catch(error){
    return [400, error]
  }
  if(!/[0-9][0-9][0-9][0-9][0-9][0-9]/.test(user)){
    return [400, "username does not match XXXXXX"]
  }
  return [user, pass]
}


app.get('/', function(req, res) {
  res.send('{\'message\':\'Welcome to the HAC API\'}')
})


app.post('/schedule', async function(req, res) {
  const loginDetails = await validateUserAndPass(req.body)
  try {
    const response = await getSchedule(loginDetails[0], loginDetails[1])
    res.send(response)
    res.status(200)
    res.end()
  } catch (error) {
    res.send(`{'error':"${error}"`)
    res.status(401)
    res.end()
    return;
  }
})


app.post('/info', async function(req, res) {
  const loginDetails = await validateUserAndPass(req.body)
  try {
    const response = await getStudentInfo(loginDetails[0], loginDetails[1])
    res.send(response)
    res.status(200)
    res.end()
  } catch (error) {
    res.send(`{'error':"${error}"`)
    res.status(401)
    res.end()
  }
})

app.post('/classes', async function(req, res) {
  const loginDetails = await validateUserAndPass(req.body)
  try {
    const response = await getClasses(loginDetails[0], loginDetails[1])
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