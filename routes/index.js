import ModelUser from '../models/ModelUser';
import ModelGroup from '../models/ModelGroup';

var express = require('express');
var router = express.Router();

var request = require('request');


// 登录换取游戏数据
router.post('/login', async (req, res, next) => {
  let data = req.body;
  let uid = data.uid;
  if (!uid) {
    // 游客，生成新账号
    let userListLen = await ModelUser.find().count();
    uid = userListLen + 1;
    data.uid = uid;
    data.isVisitor = true;
  }
  let dataTarget = await ModelUser.findOne({
    uid: uid
  })
  if (!dataTarget) {
    dataTarget = await ModelUser.create(
      data
    )
  }
  res.json({
    code: 0,
    data: {
      groupLength: 0,
      groupRank: 1,
      isVisitor: dataTarget.isVisitor,
      nickname: dataTarget.nickname,
      score: dataTarget.score,
      avatar: dataTarget.avatar,
      uid: dataTarget.uid,
      groupId: dataTarget.groupId,
      friends: dataTarget.friends,
    }
  });
});
// 获取战区总分
router.post('/group/total', async (req, res, next) => {
  let data = req.body;
  let dataGroup = await ModelGroup.findOne({
    groupId: data.groupId
  });
  if (!dataGroup) {
    dataGroup = await ModelGroup.create({
      groupId: data.groupId
    })
  }
  res.json({
    code: 0,
    data: dataGroup
  });
});
// 提交分数
router.post('/game/end', async (req, res, next) => {
  let data = req.body;
  let dataUser = await ModelUser.findOne({
    uid: data.uid
  });
  if (data.score > dataUser.score) {
    dataUser.score = data.score;
    await dataUser.updateOne({
      score: dataUser.score
    });
  }

  if (data.groupId) {
    let dataGroup = await ModelGroup.findOne({
      groupId: data.groupId
    });
    if (!dataGroup) {
      dataGroup = await ModelGroup.create({
        groupId: data.groupId
      })
    }
    dataGroup.score += data.score;
    await dataGroup.updateOne({
      score: dataGroup.score
    });
  }

  res.json({
    code: 0,
    data: dataUser
  });
});
// 排行榜
router.post('/rank', async (req, res, next) => {
  let data = req.body;
  // 1好友榜 2战区榜
  let type = data.type;
  let dataSelf = await ModelUser.findOne({
    uid: data.uid
  })
  let list = []
  if (type == 2) {
    list = await ModelUser.find({
      $or: [{
        "uid": {
          $in: dataSelf.friends
        }
      }, {
        'uid': dataSelf.uid
      }]

    }).sort({
      score: -1
    }).limit(20)

  } else if (type == 1) {
    if (dataSelf.groupId) {
      list = await ModelGroup.find({}).sort({
        score: -1
      }).limit(20)
    } else {
      list = []
    }
  }
  res.json({
    code: 0,
    data: {
      type,
      list
    }
  });
});

// 绑定好友关系
router.post('/friend/combine', async (req, res, next) => {
  let data = req.body;
  let dataSelf = await ModelUser.findOne({
    uid: data.uid
  })
  let dataTo = await ModelUser.findOne({
    uid: data.to_uid
  })
  if (dataTo && dataSelf) {
    let friendsSelf = dataSelf.friends;
    let friendsTo = dataTo.friends;
    if (friendsSelf.indexOf(dataTo.uid) == -1) {
      friendsSelf.push(dataTo.uid)
      await dataSelf.updateOne({
        friends: friendsSelf
      })
    }
    if (friendsTo.indexOf(dataSelf.uid) == -1) {
      friendsTo.push(dataSelf.uid)
      await dataTo.updateOne({
        friends: friendsTo
      })
    }
    res.json({
      code: 0,
      data: dataSelf
    });
  } else {
    res.json({
      code: -1,
      message: 'uid不存在'
    });
  }
});
// 选择代表的战队
router.post('/group/pick', async (req, res, next) => {
  let data = req.body;
  let dataTarget = await ModelUser.findOne({
    uid: data.uid
  })
  if (!dataTarget) {
    res.json({
      code: 400,
      message: '未选择战队'
    })
  } else {
    dataTarget.groupId = data.groupId;
    await dataTarget.updateOne({
      groupId: data.groupId
    })
    res.json({
      code: 0,
      data: dataTarget
    });
  }
});
export default router;