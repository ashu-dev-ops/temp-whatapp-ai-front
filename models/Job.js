const mongoose = require("mongoose");
const JobSchema = mongoose.Schema({
  company: {
    type: String,
    required: [true, "please provide company name"],
  },
  position: {
    type: String,
    required: [true, "please provide postion"],
  },
  status: {
    type: String,
    enum: ["interview", "decline", "pending"],
    default: "pending",
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User", //look for id in which model
    required: [true, "please provide user"],
  },
});
module.exports = mongoose.model("Job", JobSchema);
