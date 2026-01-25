import { Router } from 'express'
import {
	confirmEmail,
	forgotPassword,
	login,
	logout,
	refreshToken,
	register,
	resendConfirmationEmail,
	resetPassword,
	updatePassword,
} from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/authMiddleware'

const router: Router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/confirm-email', confirmEmail)
router.post('/refresh-token', refreshToken)
router.post('/reset-password', resetPassword)
router.post('/logout', authMiddleware, logout)
router.post('/forgot-password', forgotPassword)
router.post('/resend-confirmation', resendConfirmationEmail)
router.post('/update-password', authMiddleware, updatePassword)

export default router
