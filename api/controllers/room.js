import Room from "../models/Room.js";
import Departement from "../models/Departement.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const departementId = req.params.departementid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Departement.findByIdAndUpdate(departementId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
   /*export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};*/

export const updateRoomAvailability = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { dates } = req.body;

    // Vérifier si les dates sont valides
    if (!dates || !dates.start || !dates.end) {
      throw createError(400, "Invalid date range");
    }

    const startDate = new Date(dates.start);
    const endDate = new Date(dates.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw createError(400, "Invalid date format");
    }

    if (startDate >= endDate) {
      throw createError(400, "Start date must be before end date");
    }

    // Vérifier si la chambre est disponible pour les dates fournies
    const room = await Room.findById(roomId);
    const isRoomAvailable = room.roomNumbers.some((roomNumber) => {
      return !roomNumber.unavailableDates.some((unavailableDate) => {
        return (
          startDate < unavailableDate && endDate > unavailableDate
        );
      });
    });

    if (!isRoomAvailable) {
      throw createError(400, "Room is not available for the selected dates");
    }

    // Mettre à jour les dates non disponibles de la chambre
    await Room.updateOne(
      { "roomNumbers._id": roomId },
      {
        $push: {
          "roomNumbers.$.unavailableDates": { $each: [startDate, endDate] },
        },
      }
    );

    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};



export const deleteRoom = async (req, res, next) => {
  const departementId = req.params.departementid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Departement.findByIdAndUpdate(departementId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};


export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};



export const getRoomsDis = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw createError(400, "Invalid date format");
    }

    const rooms = await Room.find();

    const availableRooms = rooms.filter((room) => {
      return room.roomNumbers.some((roomNumber) => {
        return roomNumber.unavailableDates.every((unavailableDate) => {
          return startDate >= unavailableDate || endDate <= unavailableDate;
        });
      });
    });

    res.status(200).json(availableRooms);
  } catch (err) {
    next(err);
  }
};
