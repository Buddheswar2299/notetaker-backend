require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5011;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI_ONE);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Note Schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  timestamp: { type: String, required: false },
  type: { type: String, enum: ["text", "audio"], required: false },
  duration: { type: String },
  favorite: { type: Boolean, default: false },
  image: { type: String },
});

const Note = mongoose.model("Note", noteSchema);

// Routes

// Create Note
app.post("/notes", async (req, res) => {
    console.log(req.body)
  try {
    const newNote = new Note(req.body);
    await newNote.save();
    res.status(200).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
});

// Get All Notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

// Update Note
app.put("/notes/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
});

// Delete Note
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
