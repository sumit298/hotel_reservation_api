import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'Room number is required'],
        unique: true,
        trim: true
    }, 
    roomType: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['Standard', 'Deluxe', 'Suite'],
        default: 'Standard'
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Price per night is required'],
        min: [0, 'price cannot be negative']
    },
    isAvailable: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true})

const Rooms = mongoose.model('Room', RoomSchema);

export default Rooms