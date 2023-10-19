
const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
    {

    username: { type: String, required:true},
    reactionbody: { type: String },
    
  },
  { timestamps: true }
);


module.exports = reactionSchema;
