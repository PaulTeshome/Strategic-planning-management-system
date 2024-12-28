
const mongoose = require('mongoose');

const strategicPlanSchema = new mongoose.Schema(
  {
    maingoal: {
      type: String,
      required: [true, 'Main goal is required'],


    },
    goalWeight: {
        type: Number,
        required: [true, 'Goal weight is required'],
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
