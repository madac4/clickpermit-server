import { IUser, UserRole } from '../types/auth.types'
import { IUserSettings } from '../types/settings.types'

export class UserWithSettingsDTO {
	id: string
	email: string
	role: UserRole
	isEmailConfirmed: boolean
	createdAt: Date
	companyInfo: {
		name: string | null
		phone: string | null
		email: string | null
	} | null

	constructor(user: IUser, companyInfo?: IUserSettings['companyInfo']) {
		this.id = user._id.toString()
		this.email = user.email
		this.role = user.role
		this.isEmailConfirmed = user.isEmailConfirmed
		this.createdAt = user.createdAt

		this.companyInfo = companyInfo
			? {
					name: companyInfo.name || null,
					phone: companyInfo.phone || null,
					email: companyInfo.email || null,
				}
			: null
	}
}

export class UserDetailDTO {
	id: string
	email: string
	role: UserRole
	isEmailConfirmed: boolean
	isBlocked: boolean
	createdAt: Date
	companyInfo: {
		name: string
		dba?: string
		address: string
		city: string
		state: string
		zip: string
		phone: string
		fax?: string
		email: string
	} | null
	carrierNumbers: {
		mcNumber?: string
		dotNumber?: string
		einNumber?: string
		iftaNumber?: string
		orNumber?: string
		kyuNumber?: string
		txNumber?: string
		tnNumber?: string
		laNumber?: string
		notes?: string
		files: {
			filename: string
			originalname: string
			contentType: string
			size: number
		}[]
	} | null

	constructor(user: IUser, settings?: IUserSettings | null) {
		this.id = user._id.toString()
		this.email = user.email
		this.role = user.role
		this.isEmailConfirmed = user.isEmailConfirmed
		this.isBlocked = user.isBlocked
		this.createdAt = user.createdAt

		this.companyInfo = settings?.companyInfo
			? {
					name: settings.companyInfo.name,
					dba: settings.companyInfo.dba,
					address: settings.companyInfo.address,
					city: settings.companyInfo.city,
					state: settings.companyInfo.state,
					zip: settings.companyInfo.zip,
					phone: settings.companyInfo.phone,
					fax: settings.companyInfo.fax,
					email: settings.companyInfo.email,
				}
			: null

		this.carrierNumbers = settings?.carrierNumbers
			? {
					mcNumber: settings.carrierNumbers.mcNumber,
					dotNumber: settings.carrierNumbers.dotNumber,
					einNumber: settings.carrierNumbers.einNumber,
					iftaNumber: settings.carrierNumbers.iftaNumber,
					orNumber: settings.carrierNumbers.orNumber,
					kyuNumber: settings.carrierNumbers.kyuNumber,
					txNumber: settings.carrierNumbers.txNumber,
					tnNumber: settings.carrierNumbers.tnNumber,
					laNumber: settings.carrierNumbers.laNumber,
					notes: settings.carrierNumbers.notes,
					files: settings.carrierNumbers.files || [],
				}
			: null
	}
}
