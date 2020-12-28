const Event = require('../../../modals/event');
const Comment = require('../../../modals/Comment');
const { OAuth2Client } = require('google-auth-library');

const { GOOGLE_CLIENT_ID } = process.env;
module.exports.create = async function (req, res) {
  try {
    const { tokenId, parent } = req.body;
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
        return res.status(400).json({ message: 'UnAuthorised' });
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

    let event = await Event.findById(parent);
    if (event) {
      let author = user.name;
      let imageurl = user.image;
      let email = user.email;
      let text = req.body.text;

      let input = {
        author,
        imageurl,
        email,
        text,
      };
      let comment = await Comment.create(input);
      if (comment) {
        event.comment.push(comment);
        event.save();

        return res.status(200).json({
          message: 'Comment Successfully Created',
        });
      }
      return res.status(500).json({
        message: 'Comment Not Created',
      });
    }
    return res.status(422).json({
      message: 'No Such Event Found',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.fetch = async function (req, res) {
  try {
    if (req.body.parent) {
      const { parent } = req.body;
      let event = await Event.findById(parent);
      let data = [];
      if (event) {
        const promises = [];
        event.comment.forEach((id) => {
          // console.log(id);
          let promise = Comment.findById(id).then((comment) => {
            data.push(comment);
          });
          promises.push(promise);
        });
        await Promise.all(promises);
        return res.status(200).send({
          comment: data,
          message: 'List of Comments',
        });
      }
      return res.status(400).send({ message: 'No event found' });
    } else {
      let comment = await Comment.find({});
      return res.status(200).json({
        comment,
        message: 'All Comments',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports.upvote = async function (req, res) {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(401).json({ message: 'UnAuthorised' });

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
        return res.status(400).json({ error: 'UnAuthorised' });
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
    let comment = await Comment.findById(req.body._id);
    if (comment) {
      var flag = comment.upvotes.includes(user.gid);
      if (!flag) {
        comment.upvotes.push(user.gid);
        comment.save();
        return res.status(200).json({ message: 'vote added' });
      } else {
        comment.upvotes = comment.upvotes.filter((id) => id !== user.gid);
        comment.save();
        return res.status(200).json({ message: 'vote removed !!' });
      }
    } else {
      return res.status(400).json({ message: 'No Such Comment' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.downvote = async function (req, res) {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(401).json({ message: 'UnAuthorised' });

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
        return res.status(400).json({ message: 'UnAuthorised' });
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
    let comment = await Comment.findById(req.body._id);
    if (comment) {
      var flag = comment.downvotes.includes(user.gid);
      if (!flag) {
        comment.downvotes.push(user.gid);
        comment.save();
        return res.status(200).json({ message: 'vote added' });
      } else {
        comment.downvotes = comment.downvotes.filter((id) => id !== user.gid);
        comment.save();
        return res.status(200).json({ message: 'vote removed !!' });
      }
    } else {
      return res.status(400).json({ message: 'No Such Comment' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
