const mongoose = require('mongoose');

const clickByDateSchema = new mongoose.Schema({
  date: {
     type: Date,
      required: true
     },
  clickCount: { 
    type: Number,
     default: 0
     },
});

const osTypeSchema = new mongoose.Schema({
  osName: {
     type: String,
      required: true
     },
  uniqueClicks: { 
    type: Number, 
    default: 0 
},
  uniqueUsers: {
     type: Number,
     default: 0 
    },
});


const deviceTypeSchema = new mongoose.Schema({
  deviceName: {
     type: String, 
     required: true
     },
  uniqueClicks: {
     type: Number, 
     default: 0 },
  uniqueUsers: { type: Number,
     default: 0 
    },
});

const urlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  uniqueUsers: {
    type: Number,
    default: 0,
  },
  clicksByDate: [clickByDateSchema], 
  osType: [osTypeSchema], 
  deviceType: [deviceTypeSchema], 
});


const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
