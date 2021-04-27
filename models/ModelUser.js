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
    default: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2796144188,439704386&fm=26&gp=0.jpg'
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