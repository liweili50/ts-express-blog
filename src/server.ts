import App from './app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'

import PostsController from './controllers/PostsController'
import UserController from './controllers/UserController'

const result = require('dotenv').config({path:'src/config/.env'})

if (result.error) {
  throw result.error
}

const app = new App({
  port: 5000,
  controllers: [
    new UserController(),
    new PostsController()
  ],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    loggerMiddleware
  ]
})

app.listen()
