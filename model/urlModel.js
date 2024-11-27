const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: { type: String, required: true, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [
      {
        timestamp: { type: Number },
      },
    ],
    expirationDate: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
  },
  { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);
module.exports = URL;
