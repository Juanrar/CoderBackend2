import userModel from '../models/user.model.js'

export async function userExists(req, res, next) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(user == null){
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    req.user = user;
    next()
}
