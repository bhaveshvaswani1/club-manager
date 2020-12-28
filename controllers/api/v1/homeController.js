const User = require('../../../modals/User');
const Event = require('../../../modals/event');
const Poll = require('../../../modals/poll');

module.exports.home = async function (req, res) {
  try {
    let user = await User.find({}).select('-password');
    let event = await Event.find({});
    let poll = await Poll.find({});
    return res.status(200).json({
      message: 'List of Clubs and Events',
      data: {
        user,
        event,
        poll,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
