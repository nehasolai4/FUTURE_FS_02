const Lead = require("./models/Lead");

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mini CRM Backend Running 🚀");
});



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌", err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/api/leads", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();

    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.patch("/api/leads/:id", async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




app.patch("/api/leads/:id/followup", async (req, res) => {
  try {
    const { note } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.followUps.push(note);
    await lead.save();

    res.status(200).json(lead);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.delete("/api/leads/:id", async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});