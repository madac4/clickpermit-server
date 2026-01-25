"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailDTO = exports.UserWithSettingsDTO = void 0;
class UserWithSettingsDTO {
    constructor(user, companyInfo) {
        this.id = user._id.toString();
        this.email = user.email;
        this.role = user.role;
        this.isEmailConfirmed = user.isEmailConfirmed;
        this.createdAt = user.createdAt;
        this.companyInfo = companyInfo
            ? {
                name: companyInfo.name || null,
                phone: companyInfo.phone || null,
                email: companyInfo.email || null,
            }
            : null;
    }
}
exports.UserWithSettingsDTO = UserWithSettingsDTO;
class UserDetailDTO {
    constructor(user, settings) {
        this.id = user._id.toString();
        this.email = user.email;
        this.role = user.role;
        this.isEmailConfirmed = user.isEmailConfirmed;
        this.isBlocked = user.isBlocked;
        this.createdAt = user.createdAt;
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
            : null;
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
            : null;
    }
}
exports.UserDetailDTO = UserDetailDTO;
