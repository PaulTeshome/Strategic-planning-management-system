

const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema(
  {
    mainAction: {
      type: String,
      required: [true, 'Main action is required'],

    },
    difficulty: {
        type: Number,
        required: [true, 'Difficulty is required'],
        // should be in between 0-100
        // validation
        min: 0,
        max: 100,
    },


  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
