import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        maxLength: [20, 'Username cannot be greater than 30 characters'],
        minLength: [3, 'Username must be at least 3 chars long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'password must be 6 character long']
    }
}, {timestamps: true})

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

UserSchema.methods.comparePassword = async function(userPassword){
    return bcrypt.compare(userPassword, this.password)
}




const Users = mongoose.model('User', UserSchema);

export default Users;