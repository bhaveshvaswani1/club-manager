const User = require('../../../modals/User');

const Event = require('../../../modals/event');

const fs = require('fs');

const path = require('path');

module.exports.newEvent = async function (req, res) {
  try {
    Event.uploadedEImage(req, res, async function (err) {
      if (err) {
        console.log('Multer Error', err);
        res.status(500).json({ message: 'Error Uploading Image' });
      }
      let user = req.user._id;
      if (user == req.params.userid) {
        let findUser = await User.findById(user);
        if (findUser) {
          let startTime = req.body.start_time;
          let endTime = req.body.end_time;
          let eventName = req.body.event_name;
          let venue = req.body.venue;
          let eventDate = req.body.date;
          let discription = req.body.discription;
          let shortDiscription = req.body.short_discription;
          let schedule = req.body.schedule;
          let space = '\n\n--- \n';
          let imageCorrection = 'http://localhost:8000';
          discription = discription + space + schedule;
          let input = {
            user,
            startTime,
            endTime,
            venue,
            eventName,
            eventDate,
            discription,
            shortDiscription,
            schedule,
          };
          let event = await Event.create(input);
          if (event) {
            findUser.event.push(event);
            findUser.save();
            if (req.file) {
              if (event.eimage) {
                let avatarPath = event.eimage.substr(21);
                if (
                  fs.existsSync(path.join(__dirname, '../../../', avatarPath))
                ) {
                  fs.unlinkSync(path.join(__dirname, '../../../', avatarPath));
                }
              }

              console.log(req.file);
              //this is saving the path of the uploaded file into the avatar field of the user
              event.eimage =
                imageCorrection + Event.EImagePath + '/' + req.file.filename;
            }
            event.save();
            return res.status(200).json({
              message: 'Event Successfully Created',
            });
          }
          return res.status(500).json({
            message: 'Event not created',
          });
        }
        return res.status(500).json({ message: 'No user found' });
      }
      return res
        .status(401)
        .json({ message: 'Sorry you are not authorized to add events' });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports.update = async function (req, res) {
  try {
    let imageCorrection = 'http://localhost:8000';

    Event.uploadedEImage(req, res, async function (err) {
      if (err) {
        console.log('Multer Error', err);
        res.status(500).json({ message: 'Error Uploading Image' });
      }
      let event = await Event.findById(req.params.id);
      if (event) {
        let userid = req.user._id;
        let eventid = event.user;
        if (userid.equals(eventid)) {
          event.eventName = req.body.eventName;
          event.eventDate = req.body.eventDate;
          event.startTime = req.body.startTime;
          event.endTime = req.body.endTime;
          event.venue = req.body.venue;
          event.discription = req.body.discription;
          event.shortDiscription = req.body.shortDiscription;
          event.schedule = req.body.schedule;
          if (req.file) {
            if (event.eimage) {
              let avatarPath = event.eimage.substr(21);
              if (
                fs.existsSync(path.join(__dirname, '../../../', avatarPath))
              ) {
                fs.unlinkSync(path.join(__dirname, '../../../', avatarPath));
              }
            }

            console.log(req.file);
            //this is saving the path of the uploaded file into the avatar field of the user
            event.eimage =
              imageCorrection + Event.EImagePath + '/' + req.file.filename;
          }
          event.save();
          return res
            .status(200)
            .json({ message: 'Event Successfully Updated' });
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }
      return res.status(404).json({ message: 'Event not found' });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let event = await Event.findById(req.params.id);
    if (event) {
      if (event.user.equals(req.user._id)) {
        if (event.eimage) {
          let avatarPath = event.eimage.substr(21);
          if (fs.existsSync(path.join(__dirname, '../../../', avatarPath))) {
            fs.unlinkSync(path.join(__dirname, '../../../', avatarPath));
          }
        }
        event.remove();
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { event: req.params.id },
        });
        return res.status(200).json({ message: 'Event Successfully Deleted' });
      }
      return res.status(401).json({ message: 'You cannot delete this event' });
    }
    return res.status(404).json({ message: 'No such event found' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
