import express from 'express';
import RoomController from '../controllers/rooms.controller.js';

const RoomsRouter = express.Router();

RoomsRouter.post('/rooms', RoomController.create);
RoomsRouter.get('/', RoomController.fetchAll);
RoomsRouter.get('/:id', RoomController.fetchRoomById);

export default RoomsRouter;