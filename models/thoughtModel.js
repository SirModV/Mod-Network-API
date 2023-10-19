const mongoose = require("mongoose");
const reactionSchema= require("./reactionModel");

const thoughtSchema = new mongoose.Schema(
    {
    username: {type: String, requred: true},
    thoughtText: { type: String, required:true },  
    reactions: [reactionSchema], 
  },
  { timestamps: true }
);

const Thought = mongoose.model("thought", thoughtSchema);

module.exports = Thought;
