const mongoose = require('mongoose')
const moment = require('moment')

const letterSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  from: { type: mongoose.Types.ObjectId, ref: 'User' },
  to: {
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
}, { timestamps: true, versionKey: false });

letterSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    const createdAt = moment(ret.createdAt);
    const updatedAt = moment(ret.updatedAt);

    const now = moment();
    const createdAgo = createdAt.from(now)
    const updatedAgo = updatedAt.from(now)

    ret.createdAt = {
      date: createdAt.format('DD/MM/YYYY , HH:mm'),
      ago: createdAgo.replace('minutes', 'min').replace('seconds', 'sec')
    };

    ret.updatedAt = {
      date: updatedAt.format('DD/MM/YYYY , HH:mm'),
      ago: updatedAgo.replace('minutes', 'min').replace('seconds', 'sec')
    };

    return ret;
  }
});

const Letter = mongoose.model('Letter', letterSchema);

module.exports = Letter;