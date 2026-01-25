"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserBlock = exports.getUserById = exports.getAllUsersWithSettings = exports.getUsers = void 0;
const mongoose_1 = require("mongoose");
const user_dto_1 = require("../dto/user.dto");
const settings_model_1 = __importDefault(require("../models/settings.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_types_1 = require("../types/auth.types");
const response_types_1 = require("../types/response.types");
const ErrorHandler_1 = require("../utils/ErrorHandler");
exports.getUsers = (0, ErrorHandler_1.CatchAsyncErrors)(async (req, res, next) => {
    const users = await user_model_1.default.find({ role: auth_types_1.UserRole.USER });
    res.status(200).json((0, response_types_1.SuccessResponse)(users, 'Users fetched successfully'));
});
exports.getAllUsersWithSettings = (0, ErrorHandler_1.CatchAsyncErrors)(async (req, res, next) => {
    const { page, limit, role, search } = req.query;
    const filter = {
        role: { $in: [auth_types_1.UserRole.USER, auth_types_1.UserRole.MODERATOR] },
    };
    if (role && (role === auth_types_1.UserRole.USER || role === auth_types_1.UserRole.MODERATOR)) {
        filter.role = role;
    }
    if (search) {
        filter.$or = [{ email: { $regex: search, $options: 'i' } }];
    }
    const total = await user_model_1.default.countDocuments(filter);
    const skip = (page - 1) * limit;
    const users = await user_model_1.default.find(filter)
        .select('_id email role isEmailConfirmed createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const userIds = users.map(user => user._id.toString());
    const settingsMap = new Map();
    if (userIds.length > 0) {
        const settings = await settings_model_1.default.find({
            userId: { $in: userIds },
        })
            .select('userId companyInfo')
            .lean();
        settings.forEach(setting => {
            settingsMap.set(setting.userId, setting.companyInfo);
        });
    }
    const usersWithSettings = users.map(user => {
        const userId = user._id.toString();
        const companyInfo = settingsMap.get(userId);
        return new user_dto_1.UserWithSettingsDTO(user, companyInfo);
    });
    const meta = (0, response_types_1.CreatePaginationMeta)(total, page, limit);
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Users fetched successfully',
        data: {
            users: usersWithSettings,
        },
        meta,
    });
});
exports.getUserById = (0, ErrorHandler_1.CatchAsyncErrors)(async (req, res, next) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id))
        return next(new ErrorHandler_1.ErrorHandler('User not found', 404));
    const user = await user_model_1.default.findById(id).select('_id email role isEmailConfirmed isBlocked createdAt');
    if (!user)
        return next(new ErrorHandler_1.ErrorHandler('User not found', 404));
    const settings = await settings_model_1.default.findOne({ userId: id }).select('companyInfo carrierNumbers');
    const userDTO = new user_dto_1.UserDetailDTO(user, settings);
    res.status(200).json((0, response_types_1.SuccessResponse)(userDTO, 'User fetched successfully'));
});
exports.toggleUserBlock = (0, ErrorHandler_1.CatchAsyncErrors)(async (req, res, next) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById(id);
    if (!user)
        return next(new ErrorHandler_1.ErrorHandler('User not found', 404));
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json((0, response_types_1.SuccessResponse)({ id: user._id, isBlocked: user.isBlocked }, `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`));
});
