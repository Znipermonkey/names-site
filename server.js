const express = require('express')
const app = express()
const path = require('path')
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '2986c321c2e84f1f8bf79f18b005c6d7',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// rollbar.debug()
// rollbar.warning()
// rollbar.error()
// rollbar.info()
// rollbar.critical()



// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body
    rollbar.info('a user is adding a student')
   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
           rollbar.error('did not enter a name')
       } else {
           res.status(400).send('That student already exists.')
            rollbar.warning('entered a invalid name')
       }
   } catch (err) {
    console.log('my bobbios function did not work at all!')
    rollbar.critical('my bobbios function did not work')
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
