import { Router } from 'express'
import upload from '../config/multer'
import {
	createOrder,
	deleteOrderFile,
	downloadOrderFile,
	duplicateOrder,
	getOrderByNumber,
	getOrderFiles,
	getOrders,
	getStatuses,
	moderateOrder,
	updateOrderStatus,
	uploadOrderFile,
} from '../controllers/orderController'
import { authMiddleware } from '../middleware/authMiddleware'
import { rolesMiddleware } from '../middleware/rolesMiddleware'
import { UserRole } from '../types/auth.types'

const router = Router()

router.use(authMiddleware)

router.get('/paginated', getOrders)
router.get('/statuses/:type', getStatuses)
router.post(
	'/create',
	rolesMiddleware([UserRole.USER]),
	upload.array('files'),
	createOrder,
)
router.post('/duplicate/:orderId', duplicateOrder)
router.get('/:orderNumber', getOrderByNumber)
router.get('/:orderId/files/:filename', downloadOrderFile)
router.post(
	'/:orderId/moderate',
	rolesMiddleware([UserRole.ADMIN, UserRole.MODERATOR]),
	moderateOrder,
)

router.put(
	'/:orderId/status',
	rolesMiddleware([UserRole.ADMIN, UserRole.MODERATOR]),
	updateOrderStatus,
)

router.post('/:orderId/files', upload.single('file'), uploadOrderFile)
router.get('/:orderId/files', getOrderFiles)
router.get('/:orderId/files/:filename', downloadOrderFile)
router.delete('/:orderId/files/:filename', deleteOrderFile)

export default router
