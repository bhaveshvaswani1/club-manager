const mongoose = require('mongoose');

const multer = require('multer');

const path = require('path');

const EVE_IMAGE_PATH = path.join('/uploads/events/eimage');

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    shortDiscription: {
      type: String,
      required: true,
    },
    eimage: {
      type: String,
    },
    schedule: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', EVE_IMAGE_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

//static functions
eventSchema.statics.uploadedEImage = multer({ storage: storage }).single(
  'eimage'
);

eventSchema.statics.EImagePath = EVE_IMAGE_PATH;

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
