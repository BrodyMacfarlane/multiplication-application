require('dotenv').config()

// Bringing in modules
const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive')
    , axios = require('axios')

const app = express()

app.use( express.static( `${__dirname}/../build` ) );

app.use(bodyParser.json())
app.use(cors())

// Establish connection to database
massive(process.env.CONNECTION_STRING).then((db) => {
  app.set('db', db)
})

app.post('/api/checkNums', (req, res) => {
  const db = app.get('db')
  db.check_nums([req.body.num1, req.body.num2])
    .then(response => {
      console.log("Chek", req.body.num1)
      console.log("Chek2", req.body.num2)
      console.log(response[0])
      res.send(response[0])
  })
})

app.post('/api/updateAverage', (req, res) => {
  const db = app.get('db')
  db.update_average([req.body.num1, req.body.num2, req.body.avgTime, req.body.timesencountered])
    .then(response => {
      // console.log("Upd9", response)
      res.send(response[0])
    })
})

app.post('/api/addNewNum', (req, res) => {
  const db = app.get('db')
  db.add_new_num([req.body.num1, req.body.num2, req.body.avgTime, 1])
    .then(response => {
      // console.log("Add", response)
      res.send(response[0])
    })
})

const path = require('path')
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

const PORT = 3535
app.listen(PORT, console.log(`Listening on port ${PORT}`))