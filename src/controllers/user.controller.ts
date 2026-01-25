import { NextFunction, Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { UserDetailDTO, UserWithSettingsDTO } from '../dto/user.dto'
import Settings from '../models/settings.model'
import User from '../models/user.model'
import { UserRole } from '../types/auth.types'
import {
	CreatePaginationMeta,
	PaginationMeta,
	PaginationQuery,
	SuccessResponse,
} from '../types/response.types'
import { CatchAsyncErrors, ErrorHandler } from '../utils/ErrorHandler'

export const getUsers = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await User.find({ role: UserRole.USER })

		res.status(200).json(
			SuccessResponse(users, 'Users fetched successfully'),
		)
	},
)

export const getAllUsersWithSettings = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { page, limit, role, search } =
			req.query as unknown as PaginationQuery

		const filter: any = {
			role: { $in: [UserRole.USER, UserRole.MODERATOR] },
		}

		if (role && (role === UserRole.USER || role === UserRole.MODERATOR)) {
			filter.role = role
		}

		if (search) {
			filter.$or = [{ email: { $regex: search, $options: 'i' } }]
		}

		const total = await User.countDocuments(filter)

		const skip = (page - 1) * limit
		const users = await User.find(filter)
			.select('_id email role isEmailConfirmed createdAt')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		const userIds = users.map(user => user._id.toString())
		const settingsMap = new Map()

		if (userIds.length > 0) {
			const settings = await Settings.find({
				userId: { $in: userIds },
			})
				.select('userId companyInfo')
				.lean()
			settings.forEach(setting => {
				settingsMap.set(setting.userId, setting.companyInfo)
			})
		}

		const usersWithSettings = users.map(user => {
			const userId = user._id.toString()
			const companyInfo = settingsMap.get(userId)
			return new UserWithSettingsDTO(user, companyInfo)
		})

		const meta: PaginationMeta = CreatePaginationMeta(total, page, limit)

		res.status(200).json({
			status: 200,
			success: true,
			message: 'Users fetched successfully',
			data: {
				users: usersWithSettings,
			},
			meta,
		})
	},
)

export const getUserById = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params

		if (!isValidObjectId(id))
			return next(new ErrorHandler('User not found', 404))

		const user = await User.findById(id).select(
			'_id email role isEmailConfirmed isBlocked createdAt',
		)

		if (!user) return next(new ErrorHandler('User not found', 404))

		const settings = await Settings.findOne({ userId: id }).select(
			'companyInfo carrierNumbers',
		)

		const userDTO = new UserDetailDTO(user, settings)

		res.status(200).json(
			SuccessResponse(userDTO, 'User fetched successfully'),
		)
	},
)

export const toggleUserBlock = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params

		const user = await User.findById(id)
		if (!user) return next(new ErrorHandler('User not found', 404))

		user.isBlocked = !user.isBlocked
		await user.save()

		res.status(200).json(
			SuccessResponse(
				{ id: user._id, isBlocked: user.isBlocked },
				`User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
			),
		)
	},
)
