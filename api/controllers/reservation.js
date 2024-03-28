import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const createReservation = async (req, res, next) => {
  const { user, room, startTime, endTime } = req.body;

  try {
    // Vérifiez s'il existe des réservations existantes pour la salle de réunion et la période spécifiée
    const existingReservation = await Reservation.findOne({
      room: room,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Vérifiez si les périodes se chevauchent
        { startTime: { $gte: startTime, $lt: endTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ]
    });

    if (existingReservation) {
      // Il y a un conflit de réservation
      return res.status(409).json({ message: 'Conflit de réservation: la salle de réunion est déjà réservée pour cette période.' });
    }

    // Créez une nouvelle réservation car il n'y a pas de conflit
    const reservation = new Reservation({
      user: user,
      room: room,
      startTime: startTime,
      endTime: endTime
    });

    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReservation = async (req, res, next) => {
  const { startDate, endDate } = req.body;

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { startDate, endDate },
      { new: true }
    );

    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json("Reservation has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();

    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};
