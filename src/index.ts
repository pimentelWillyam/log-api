// importando classes
import App from './api/App'
import Crypto from './helper/Crypto'
import Mariadb from './data/Mariadb'
import LogRouter from './api/router/LogRouter'
import LogController from './api/controller/LogController'
import LogRepository from './api/repository/LogRepository'
import LogValidator from './api/validator/LogValidator'
import LogEntity from './api/entity/LogEntity'
import UserRouter from './api/router/UserRouter'
import UserController from './api/controller/UserController'
import UserRepository from './api/repository/UserRepository'
import UserValidator from './api/validator/UserValidator'
import UserEntity from './api/entity/UserEntity'

// importando .env
import * as dotenv from 'dotenv-safe'

// instanciando classe
const crypto = new Crypto()
const mariadb = new Mariadb([LogEntity, UserEntity])
const logRepository = new LogRepository(mariadb.dataSource, LogEntity)
const logValidator = new LogValidator()
const logController = new LogController(logRepository, logValidator)
const logRouter = new LogRouter(logController)
const userRepository = new UserRepository(mariadb.dataSource, UserEntity, crypto)
const userValidator = new UserValidator()
const userController = new UserController(userRepository, userValidator)
const userRouter = new UserRouter(userController)
const app = new App(logRouter, userRouter)

// iniciando banco de dados e app
dotenv.config()
void mariadb.start()
app.start()
