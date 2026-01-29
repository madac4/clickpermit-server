import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { JwtDTO } from '../types/auth.types'
import { ErrorHandler } from '../utils/ErrorHandler'

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) return next(new ErrorHandler('No token provided', 401))

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as JwtDTO

		if (!decoded.id || !decoded.role) {
			return next(new ErrorHandler('Invalid token payload', 401))
		}

		const user = await User.findById(decoded.id).select('isBlocked')

		if (!user) return next(new ErrorHandler('User not found', 404))

		if (user.isBlocked) {
			return next(
				new ErrorHandler(
					'Your account has been blocked. Please contact support.',
					503,
				),
			)
		}

		req.user = decoded
		next()
	} catch (error) {
		return next(new ErrorHandler('Invalid token', 401))
	}
}

export const decodeToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<JwtDTO | ErrorHandler | null> => {
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) return null

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as JwtDTO

		if (!decoded.id || !decoded.role) {
			return new ErrorHandler('Invalid token payload', 401)
		}

		req.user = decoded
		return decoded
	} catch (error) {
		return new ErrorHandler('Invalid token', 401)
	}
}
