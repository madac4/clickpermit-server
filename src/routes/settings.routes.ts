import { Router } from 'express'
import upload from '../config/multer'
import {
	deleteFile,
	downloadFile,
	getCarrierFiles,
	getCarrierNumbers,
	getCompanySettings,
	updateCarrierNumbers,
	updateCompanyInfo,
	uploadCarrierFile,
} from '../controllers/settings.controller'
import { authMiddleware } from '../middleware/authMiddleware'

const router: Router = Router()

router.get('/company-info', authMiddleware, getCompanySettings)
router.put('/company-info', authMiddleware, updateCompanyInfo)
router.get('/carrier-numbers', authMiddleware, getCarrierNumbers)
router.put('/carrier-numbers', authMiddleware, updateCarrierNumbers)
router.post(
	'/carrier-numbers/files',
	authMiddleware,
	upload.single('file'),
	uploadCarrierFile,
)
router.get('/carrier-numbers/files', authMiddleware, getCarrierFiles)
router.get('/carrier-numbers/files/:filename', authMiddleware, downloadFile)
router.delete('/carrier-numbers/files/:filename', authMiddleware, deleteFile)

export default router
