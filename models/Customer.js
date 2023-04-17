const mongoose = require("mongoose");
const CustomerSchema = mongoose.Schema({
  customername: {
    type: String,
    required: [true, "please provide customer name"],
  },
  phone: {
    type: String,

    required: [true, "please provide phone number"],
    // match: [/^(?:\+91|0)?[6789]\d{9}$/, "Please provide a valid phone number"],
  },
  interest: {
    type: String,
    enum: ["tech", "auto", "engergy"],
    default: "tech",
  },
  dob: {
    type: String,
    // required: [true, "please provide valid date"],
    // "dateOfBirth": "1990-01-01"
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "other",
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User", //look for id in which model
    required: [true, "please provide user"],
  },
  duplicate: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Customer", CustomerSchema);
