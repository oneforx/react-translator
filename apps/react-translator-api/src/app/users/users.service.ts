import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { User } from './user.entity';
  
@Injectable()
export class UsersService {
    private readonly users: User[] = [
        {
            userId: 1,
            email: "john@gmail.com",
            username: 'john',
            password: 'changeme',
            roles: [Role.Admin]
        },
        {
            userId: 2,
            email: "maria@gmail.com",
            username: 'maria',
            password: 'guess',
            roles: [Role.User]
        },
    ];

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }
}
