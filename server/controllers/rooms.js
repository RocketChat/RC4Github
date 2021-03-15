const axios = require("axios");
const { rocketChatDomain, rc_uid, rc_token } = require("../config/constants");

module.exports.createRoom = async function (req, res) {
  try {
    const headers = {
      "X-Auth-Token": req.body.rc_token,
      "X-User-Id": req.body.rc_uid,
      "Content-type": "application/json",
    };

    const rcCreateChannelResponse = await axios({
      method: "post",
      url: `${rocketChatDomain}/api/v1/${
        req.body.type === "p" ? "groups" : "channels"
      }.create`,
      headers: headers,
      data: {
        name: req.body.channel,
        members: req.body.members,
      },
    });

    await axios({
      method: "post",
      url: `${rocketChatDomain}/api/v1/${
        req.body.type === "p" ? "groups" : "channels"
      }.setTopic`,
      headers: headers,
      data: {
        roomId:
          rcCreateChannelResponse.data[
            `${req.body.type === "p" ? "group" : "channel"}`
          ]._id,
        topic: req.body.topic,
      },
    });

    // Set associated repository in channel custom fields
    const rcSetCustomFields = await axios({
      method: "post",
      url: `${rocketChatDomain}/api/v1/${
        req.body.type === "p" ? "groups" : "channels"
      }.setCustomFields`,
      headers: headers,
      data: {
        roomId:
          rcCreateChannelResponse.data[
            `${req.body.type === "p" ? "group" : "channel"}`
          ]._id,
        customFields: {
          github_repository: req.body.channel.replace("_", "/"),
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: rcSetCustomFields.data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};

module.exports.fetchRoomMembers = async (req, res) => {
  try {
    const roomMembers = await axios({
      method: "get",
      url: `${rocketChatDomain}/api/v1/channels.members`,
      headers: {
        "Content-type": "application/json",
        "X-Auth-Token": `${rc_token}`,
        "X-User-Id": `${rc_uid}`,
      },
      params: {
        roomName: req.query.roomName,
      },
    });
    return res
      .status(200)
      .json({ success: true, data: roomMembers.data.members });
  } catch (err) {
    console.log("ERROR --->", err);
    return res.status(500).json({ success: false, error: err });
  }
};
