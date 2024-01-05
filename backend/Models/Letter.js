const mongoose = require('mongoose')
const moment = require('moment')

const letterSchema = new mongoose.Schema({
  from: { type: mongoose.Types.ObjectId, ref: 'User' },
  to: {
    type: String,
    default: "admin"
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false
  },
  sender: {
    type: String,
    default: null
  },
  status: {
    type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: "PENDING",
  },
  viewAccessids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  actions: {
    type: String,
    default: ""
  },
  comments: {
    type: String,
    default: ""
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, versionKey: false });

letterSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    const createdAt = moment(ret.createdAt);
    const updatedAt = moment(ret.updatedAt);

    const now = moment();
    const createdAgo = createdAt.from(now)
    const updatedAgo = updatedAt.from(now)

    ret.createdAt = {
      date: createdAt.format('DD/MM/YYYY'),
      time: createdAt.format('hh:mm A'), // 'hh:mm A' will give you time in AM/PM format
      ago: createdAgo.replace('minutes', 'min').replace('seconds', 's').replace('hours', 'h').replace('days', 'd')
    };

    ret.updatedAt = {
      date: updatedAt.format('DD/MM/YYYY'),
      time: updatedAt.format('hh:mm A'), // 'hh:mm A' will give you time in AM/PM format
      ago: updatedAgo.replace('minutes', 'min').replace('seconds', 's').replace('hours', 'h').replace('days', 'd')
    };

    return ret;
  }
});

const Letter = mongoose.model('Letter', letterSchema);

module.exports = Letter;