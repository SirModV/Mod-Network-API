const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {name: {type: String},
        username: { type: String, required: true,unique: true, trim:true },
        email: { type: String,
        match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email address.',
        ],
        dropDups: true,
        required: true, 
        unique: true },
        thoughts:[{thoughtId:{type: mongoose.Schema.Types.ObjectId, ref: 'Thought'}}],
        friends: [{ type: String }]

    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
