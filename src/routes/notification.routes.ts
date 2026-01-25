import { Router } from 'express'
import {
	createNotification,
	deleteNotification,
	getNotificationStats,
	getNotifications,
	markAllNotificationsAsRead,
	markNotificationsAsRead,
	updateNotification,
} from '../controllers/notifications.controller'
import { authMiddleware } from '../middleware/authMiddleware'
import { rolesMiddleware } from '../middleware/rolesMiddleware'
import { UserRole } from '../types/auth.types'

const router = Router()

router.use(authMiddleware)

router.get('/', getNotifications)
router.get('/stats', getNotificationStats)
router.patch('/mark-read', markNotificationsAsRead)
router.patch('/mark-all-read', markAllNotificationsAsRead)
router.patch('/:id', updateNotification)
router.delete('/:id', deleteNotification)
router.post(
	'/',
	rolesMiddleware([UserRole.ADMIN, UserRole.MODERATOR]),
	createNotification,
)

export default router
