import { Router } from 'express'
import {
  getCurrentUser,
  googleAuth,
  loginWithPassword,
  signupWithPassword
} from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/google', googleAuth)
router.post('/signup', signupWithPassword)
router.post('/login', loginWithPassword)
router.get('/me', requireAuth, getCurrentUser)

export default router
