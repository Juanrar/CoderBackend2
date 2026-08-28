import userModel from "../models/user.model.js"

export class UserDAO{
    async getUserByEmail(email){
        return await userModel.findOne(email);
    }

    async getUserById(userId){
         return await userModel.findById(userId);
    }

    async create(data){
        return await userModel.create(data);
    }
}