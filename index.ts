import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import config from 'config'
import connect from './src/utils/database'
import logger from './src/utils/logger'
import { routes } from './src/routes'
import { userTokenMiddleware } from './src/middlewares/userTokenMiddleware'

const port = config.get<number>('port')
const app = express()

app.use(express.json())
app.use(userTokenMiddleware)

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`)
  await connect()
  routes(app)
})
