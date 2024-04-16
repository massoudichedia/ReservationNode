import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import departementsRoute from "./routes/departements.js";
import roomsRoute from "./routes/rooms.js";
import reservationRoute from "./routes/reservation.js"; // Utilisation du routeur pour les réservations
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});


// Middleware pour la politique de sécurité du contenu
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "style-src 'self' https://www.gstatic.com;");
  next();
});

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Set the views directory and the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/departements", departementsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/reservations", reservationRoute); // Utilisation du routeur pour les réservations

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, "views")));

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.post("/login", (req, res) => {
  // Traitement des données du formulaire ici
  res.send("Register route is working."); // Vous pouvez également rediriger ou renvoyer d'autres données en cas de succès
});


app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));




app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
