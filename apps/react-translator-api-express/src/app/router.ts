import { Router } from 'express'
import AuthController from './auth/auth.controller'

const ApiRouter = Router()

ApiRouter.use("/auth", AuthController)

export default ApiRouter