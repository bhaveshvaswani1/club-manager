const Poll = require('../../../modals/poll');

const User = require('../../../modals/User');

const { OAuth2Client } = require('google-auth-library');
const { GOOGLE_CLIENT_ID } = process.env;

module.exports.createPoll = async function (req, res) {
  try {
    let userid = req.params.id;
    console.log(req.body);
    if (userid == req.user._id) {
      let pollName = req.body.poll_name;
      let discription = req.body.discription;
      let startTime = req.body.start_time;
      let endTime = req.body.end_time;
      let option1 = req.body.option_1;
      let option2 = req.body.option_2;
      let option3 = req.body.option_3;
      let option4 = req.body.option_4;
      let vote1 = 0;
      let vote2 = 0;
      let vote3 = 0;
      let vote4 = 0;
      let input = {
        pollName,
        discription,
        startTime,
        endTime,
        option1,
        option2,
        option3,
        option4,
        vote1,
        vote2,
        vote3,
        vote4,
        user: userid,
      };
      let poll = await Poll.create(input);
      if (poll) {
        let user = await User.findById(req.user._id);
        if (user) {
          poll.username = user.username;
          poll.save();
          user.poll.push(poll);
          user.save();
          return res.status(200).json({ message: 'Poll Successfully Created' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      return res
        .status(500)
        .json({ message: 'Poll not created, Please try again later' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.vote = async function (req, res) {
  try {
    const { tokenId, parent, option } = req.body;

    if (!tokenId) {
      return res.status(401).json({ message: 'UnAuthorised' });
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    var response = null;
    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: GOOGLE_CLIENT_ID,
      });
      response = ticket.getPayload();
      if (
        response.iss !== 'accounts.google.com' &&
        response.aud !== GOOGLE_CLIENT_ID
      )
        return res.status(400).json({ message: 'Bad Request' });
    } catch (err) {
      return res.status(401).json({ message: 'UnAuthorised' });
    }
    const user = {
      email: response.email,
      image: response.picture,
      social_id: response.sub,
      name: response.name,
      gid: response.sub,
    };

    let poll = await Poll.findById(parent);
    let userFound = false;

    if (poll) {
      await poll.votedUser.forEach((voteUser) => {
        if (voteUser == user.gid) {
          userFound = true;
        }
      });
      if (!userFound) {
        if (option == 1) {
          let count = poll.vote1;
          count = count + 1;
          poll.vote1 = count;
        } else if (option == 2) {
          let count = poll.vote2;
          count = count + 1;
          poll.vote2 = count;
        } else if (option == 3) {
          if (poll.option3) {
            let count = poll.vote3;
            count = count + 1;
            poll.vote3 = count;
          } else {
            return res.status(400).json({ message: 'No Such Option in Poll' });
          }
        } else {
          if (poll.option4) {
            let count = poll.vote4;
            count = count + 1;
            poll.vote4 = count;
          } else {
            return res.status(400).json({ message: 'No Such Option in Poll' });
          }
        }
        poll.votedUser.push(user.gid);
        poll.save();
        return res.status(200).json({ message: 'Successfully Voted' });
      } else {
        return res
          .status(401)
          .json({ message: 'You Have Already Voted For The Poll' });
      }
    }
    return res.status(400).json({ message: 'No Such Poll Found' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.all = async function (req, res) {
  try {
    let polls = await Poll.find({});
    return res.status(200).json({
      polls,
      message: 'List Of Polls',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let poll = await Poll.findById(req.params.id);
    if (poll) {
      if (poll.user.equals(req.user._id)) {
        poll.remove();
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { poll: req.params.id },
        });
        return res.status(200).json({ message: 'Poll Successfully Deleted' });
      }
      return res.status(401).json({ message: 'Unauthorised' });
    }
    return res.status(400).json({ message: 'No Such Poll Exists' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
