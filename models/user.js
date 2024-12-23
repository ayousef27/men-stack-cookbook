const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true // createdAt and updatedAt
})

const User = mongoose.model("User", userSchema )
module.exports = User