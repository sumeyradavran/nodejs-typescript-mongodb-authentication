import { Request, Response } from 'express'
import config from 'config'

import { createSession, findSessions } from '../services/session.service'
import { validatePassword } from '../services/user.service'
import { signJwt } from '../utils/jwt'

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body)

  if (!user) {
    return res.status(401).send('Invalid email or password')
  }
  // create a session
  createSession(user._id, req.get('user-agent') || '')
    .then((session) => {
      // create an access token
      const accessToken = signJwt(
        { ...user, session: session._id },
        'accessTokenPrivateKey',
        { expiresIn: config.get('accessTokenTtl') }
      )

      // create a refresh token
      const refreshToken = signJwt(
        { ...user, session: session._id },
        'refreshTokenPrivateKey',
        { expiresIn: config.get('refreshTokenTtl') }
      )

      return res.send({ accessToken, refreshToken })
    })
    .catch((error) => {
      return res.status(409).send({ error: error.message })
    })
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id
  findSessions({ user: userId, valid: true })
    .then((sessions) => {
      return res.send(sessions)
    })
    .catch((error) => {
      return res.status(409).send(error)
    })
}
