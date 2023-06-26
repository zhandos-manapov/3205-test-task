import 'express-async-errors'
import express, { Express, urlencoded, json, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

//Routes
import userRouter from './routes/user/user.route'
import errorHandler from './middleware/error-handler'
import { NotFoundError } from './errors'

dotenv.config()

const app: Express = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(morgan('short'))

// Routes
app.use('/api/v1/user', userRouter)

app.use('/', (req: Request, res: Response) => {
  throw new NotFoundError('Route was not found')
})
app.use(errorHandler)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
