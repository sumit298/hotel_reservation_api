import express from 'express';
import ReservationController from '../controllers/ReservationController.js';
import ReservationValidation from '../utils/ReservationValidation.js';
import AuthMiddleWare from '../middleware/authMiddleWare.js';
import CancelReasonValidation from '../utils/CancelReasonValidation.js';

const ReservationRouter = express.Router();

ReservationRouter.post('/reservation', AuthMiddleWare.auth, ReservationController.reservation);
ReservationRouter.get('/fetchReservedUsers', AuthMiddleWare.auth, ReservationController.currentReservedUsers);
ReservationRouter.put('/:id/cancelReservation', AuthMiddleWare.auth, CancelReasonValidation, ReservationController.cancelReservation);
ReservationRouter.get('/reservation/:id', AuthMiddleWare.auth, ReservationController.reservationDetailsById)

export default ReservationRouter;