import { Router } from 'express'
import {
	getAllUsersWithSettings,
	getUserById,
	getUsers,
	toggleUserBlock,
} from '../controllers/user.controller'
import { authMiddleware } from '../middleware/authMiddleware'
import { rolesMiddleware } from '../middleware/rolesMiddleware'
import { UserRole } from '../types/auth.types'

const router = Router()

router.use(authMiddleware)

router.get('/all', rolesMiddleware([UserRole.ADMIN]), getAllUsersWithSettings)
router.patch('/:id/block', rolesMiddleware([UserRole.ADMIN]), toggleUserBlock)
router.get('/:id', rolesMiddleware([UserRole.ADMIN]), getUserById)
router.get('/', getUsers)

export default router
