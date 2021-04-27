'use strict';

import mongoose from '../mongodb/db'

const Schema = mongoose.Schema;
const ModelUser = new Schema({
  nickname: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  uid: {
    type: String,
    default: ''
  },
  groupId: {
    type: String,
    default: ''
  },
  friends: {
    type: Array,
    default: []
  }
})

export default mongoose.model('ModelUser', ModelUser);