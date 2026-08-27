import userModel from "../models/user.model.js"

export class UserDAO{
    async getUserByEmail(email){
        return await userModel.findOne(email)
    }
}