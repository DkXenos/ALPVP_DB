import { Request } from "express"
import { CompanyJWTPayload } from "../utils/jwt-util"

export interface CompanyRequest extends Request {
    company?: CompanyJWTPayload
}
