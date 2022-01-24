const User = require('../../../models/User');
const Board = require('../../../models/Board');
const Card = require('../../../models/Card');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = async (res, boardId, userId) => {
  //find the board as long as this user is in the board
  const board = await Board.findOne({
    _id: boardId,
    users: { $elemMatch: { user: userId } },
  });

  //board does not exist under this user
  if (!board) {
    return res.status(404).json({ errors: [{ msg: 'Board does not exist' }] });
  }

  //find this user's permissions in the board
  const users = board.users;
  const permission = users.find((u) => userId.equals(u.user)).permission;

  //if owner, remove the board
  if (permission.localeCompare('Owner') === 0) {
    //delete all the cards under this board
    await Card.deleteMany({ board: boardId });
    //board does exist, remove it
    board.remove();
  } else {
    //otherwise just remove the user from the board
    const newUsers = users.filter((u) => !userId.equals(u.user));
    board.users = newUsers;

    board.save();
  }
};
