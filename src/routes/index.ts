import { Express } from 'express'
import {
  createUserSessionController,
  deleteUserSessionController,
  getUserSessionsController,
} from 'controllers/session.controller'
import { createUserController } from 'controllers/user.controller'
import { getUserMiddleware } from 'middlewares/getUserMiddleware'
import { validateSchemaMiddleware } from 'middlewares/validateSchemaMiddleware'
import { createSessionSchema } from 'schemas/session.schema'
import { createUserSchema } from 'schemas/user.schema'

export const routes = (app: Express) => {
  app.post(
    '/api/users',
    validateSchemaMiddleware(createUserSchema),
    createUserController
  )
  app.post(
    '/api/sessions',
    validateSchemaMiddleware(createSessionSchema),
    createUserSessionController
  )
  app.get('/api/sessions', getUserMiddleware, getUserSessionsController)
  app.delete('/api/sessions', getUserMiddleware, deleteUserSessionController)
}
