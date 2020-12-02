require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { v4: uuid } = require('uuid')

const app = express()

const users = [
  {
    "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    "username": "sallyStudent",
    "password": "c00d1ng1sc00l",
    "favoriteClub": "Cache Valley Stone Society",
    "newsLetter": "true"
  },
  {
    "id": "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
    "username": "johnBlocton",
    "password": "veryg00dpassw0rd",
    "favoriteClub": "Salt City Curling Club",
    "newsLetter": "false"
  }
]

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(express.json())
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {

  res
    .send('Hello Heroku')
})

app.post('/', (req, res) => {

  res
    .send('POST request received.')
})

app.post('/user', (req,res) =>{
  const {username, password, favoriteClub, newsLetter=false} = req.body

  if (!username) {
    return res
      .status(400)
      .send('Username required');
  }
  if (username.length < 6 || username.length > 20) {
    return res
      .status(400)
      .send('Username must be between 6 and 20 characters');
  }
  
  if (!password) {
    return res
      .status(400)
      .send('Password required');
  }
  if (password.length < 8 || password.length > 36) {
    return res
      .status(400)
      .send('Password must be between 8 and 36 characters');
  }
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res
      .status(400)
      .send('Password must be contain at least one digit');
  }
  
  if (!favoriteClub) {
    return res
      .status(400)
      .send('favorite Club required');
  }
  const clubs = [
    'Cache Valley Stone Society',
    'Ogden Curling Club',
    'Park City Curling Club',
    'Salt City Curling Club',
    'Utah Olympic Oval Curling Club'
  ];
  if (!clubs.includes(favoriteClub)) {
    return res
      .status(400)
      .send('Not a valid club');
  }

  const id = uuid()

  const newUser = {
    id,
    username,
    password,
    favortieClub,
    newsletter
  }

  users.push(newUser)

  res
  .status(201)
  .location(`http://localhost:8000/user/${id}`)
  .json({id: id});
})

app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params

  const index = users.findIndex(u => u.id === userId)
  // make sure we actually find a user with that id
  if (index === -1) {
    return res
      .status(404)
      .send('User not found')
  }

  users.splice(index, 1)

  res
  .status(204)
  .end()
})

app.get('/user', (req, res) => {
  res
    .json(users);
});

app.use(function errorHandler(error, req, res, next) {
       let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

module.exports = app