import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/sinhalaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Model
const TextSchema = new mongoose.Schema({
  content: { type: String, required: true },
});
const Text = mongoose.model("Text", TextSchema);

// ✅ Routes
app.post("/add", async (req, res) => {
  try {
    const { content } = req.body;
    const newText = new Text({ content });
    await newText.save();
    res.json({ message: "Sinhala text saved!", data: newText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/texts", async (req, res) => {
  try {
    const texts = await Text.find();
    res.json(texts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
