'use strict';

import mongoose from '../mongodb/db'

const Schema = mongoose.Schema;
const ModelGroup = new Schema({
  groupId: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  }
})

export default mongoose.model('ModelGroup', ModelGroup);