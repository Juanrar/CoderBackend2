import { UserDAO } from '../dao/user.dao.js'

const userDAO = new UserDAO();

export class UserRepository {
    async getUserByEmail(email){
        return userDAO.getUserByEmail(email);
    }

    async createUser(data){
        return userDAO.create(data);
    }
}
