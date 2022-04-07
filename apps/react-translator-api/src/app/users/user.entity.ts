import { Role } from "../enums/role.enum"

export class User {
    userId: number
    email: string
    username: string
    password: string
    roles: Role[]
}