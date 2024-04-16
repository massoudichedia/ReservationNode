import Room from "../models/Room.js";
import User from "../models/User.js";
import express from "express";
import Reservation from "../models/Reservation.js";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";

const router = express.Router();


// Création de la fonction createReservation
export const createReservation = async (req, res) => {
  const { user, room, startDate, endDate } = req.body;

  try {
    // Vérification des réservations existantes pour la chambre et la période spécifiées
    const existingReservation = await Reservation.findOne({
      room: room,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
        { startDate: { $gte: startDate, $lt: endDate } },
        { endDate: { $gt: startDate, $lte: endDate } },
      ],
    });

    if (existingReservation) {
      return res.status(409).json({
        message:
          "Conflit de réservation : la chambre est déjà réservée pour cette période.",
      });
    }

    // Création d'une nouvelle réservation s'il n'y a pas de conflit
    const reservation = await Reservation.create({
      user,
      room,
      startDate,
      endDate,
    });

    // Envoi d'un e-mail de confirmation
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zommitiwajdi@gmail.com",
        pass: "gaugypeimcbgjyre",
      },
    });

    const mailOptions = {
      from: "zommitiwajdi@gmail.com      ",
      to: "zommitiwajdi@gmail.com      ",
      subject: "Confirmation de réservation",
      text: "Votre réservation a été confirmée avec succès !",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("E-mail envoyé : " + info.response);
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReservation = async (req, res, next) => {
  const { startDate, endDate } = req.body;

  try {
    // Mettre à jour la réservation par ID
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { startDate, endDate },
      { new: true }
    );

    // Envoyer une notification par e-mail à l'utilisateur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zommitiwajdi@gmail.com",
        pass: "gaugypeimcbgjyre",
      },
    });

    const mailOptions = {
      from: "zommitiwajdi@gmail.com",
      to: "zommitiwajdi@gmail.com",
      subject: "Reservation Update",
      text: "Your reservation has been updated successfully!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
};


// Delete a reservation
// Fonction pour supprimer une réservation
export const deleteReservation = async (req, res, next) => {
  try {
    // Supprimer la réservation par ID
    await Reservation.findByIdAndDelete(req.params.id);

    // Envoyer une notification par e-mail à l'utilisateur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zommitiwajdi@gmail.com",
        pass: "gaugypeimcbgjyre",
      },
    });

    const mailOptions = {
      from: "zommitiwajdi@gmail.com",
      to: "zommitiwajdi@gmail.com",
      subject: "Reservation Cancellation",
      text: "Your reservation has been cancelled.",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json("Reservation has been deleted.");
  } catch (err) {
    next(err);
  }
};



// Get a single reservation
router.get("/:id", async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    res.status(200).json(reservation);
  } catch (err) {
    next(err);
  }
});

// Get all reservations
router.get("/", async (req, res, next) => {
  try {
    const reservations = await Reservation.find();

    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
});


// reservation.js

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

// Export other functions if needed


export default router;
