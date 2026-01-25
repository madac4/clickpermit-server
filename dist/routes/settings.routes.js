"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../config/multer"));
const settings_controller_1 = require("../controllers/settings.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/company-info', authMiddleware_1.authMiddleware, settings_controller_1.getCompanySettings);
router.put('/company-info', authMiddleware_1.authMiddleware, settings_controller_1.updateCompanyInfo);
router.get('/carrier-numbers', authMiddleware_1.authMiddleware, settings_controller_1.getCarrierNumbers);
router.put('/carrier-numbers', authMiddleware_1.authMiddleware, settings_controller_1.updateCarrierNumbers);
router.post('/carrier-numbers/files', authMiddleware_1.authMiddleware, multer_1.default.single('file'), settings_controller_1.uploadCarrierFile);
router.get('/carrier-numbers/files', authMiddleware_1.authMiddleware, settings_controller_1.getCarrierFiles);
router.get('/carrier-numbers/files/:filename', authMiddleware_1.authMiddleware, settings_controller_1.downloadFile);
router.delete('/carrier-numbers/files/:filename', authMiddleware_1.authMiddleware, settings_controller_1.deleteFile);
exports.default = router;
