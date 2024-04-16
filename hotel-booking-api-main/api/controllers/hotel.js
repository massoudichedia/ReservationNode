import Departement from "../models/Departement.js";
import Room from "../models/Room.js";

export const createDepartement = async (req, res, next) => {
  const newDepartement = new Departement(req.body);

  try {
    const savedDepartement = await newDepartement.save();
    res.status(200).json(savedDepartement);
  } catch (err) {
    next(err);
  }
};
export const updateDepartement = async (req, res, next) => {
  try {
    const updatedDepartement = await Departement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedDepartement);
  } catch (err) {
    next(err);
  }
};
export const deleteDepartement = async (req, res, next) => {
  try {
    await Departement.findByIdAndDelete(req.params.id);
    res.status(200).json("Departement has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getDepartement = async (req, res, next) => {
  try {
    const departement = await Departement.findById(req.params.id);
    res.status(200).json(departement);
  } catch (err) {
    next(err);
  }
};
export const getDepartements = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const departements = await Departement.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(departements);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Departement.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const departementCount = await Departement.countDocuments({ type: "departement" });
    const apartmentCount = await Departement.countDocuments({ type: "apartment" });
    const resortCount = await Departement.countDocuments({ type: "resort" });
    const villaCount = await Departement.countDocuments({ type: "villa" });
    const cabinCount = await Departement.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "departement", count: departementCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getDepartementRooms = async (req, res, next) => {
  try {
    const departement = await Departement.findById(req.params.id);
    const list = await Promise.all(
      departement.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
