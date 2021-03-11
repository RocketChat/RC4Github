const axios = require("axios");
const constants = require("./../config/constants");

module.exports = async function (req, res) {
  try {
    const headers = {
      "X-Auth-Token": req.body.rc_token,
      "X-User-Id": req.body.rc_uid,
      "Content-type": "application/json",
    };

    const rcCreateChannelResponse = await axios({
      method: "post",
      url: `${constants.rocketChatDomain}/api/v1/channels.create`,
      headers: headers,
      data: {
        name: req.body.channel,
        members: req.body.members,
      },
    });

    const rcSetChannelTopic = await axios({
      method: "post",
      url: `${constants.rocketChatDomain}/api/v1/channels.setTopic`,
      headers: headers,
      data: {
        roomId: rcCreateChannelResponse.data.channel._id,
        topic: req.body.topic,
      },
    });

    if (req.body.type === "p") {
      const rcSetChannelType = await axios({
        method: "post",
        url: `${constants.rocketChatDomain}/api/v1/channels.setType`,
        headers: headers,
        data: {
          roomId: rcCreateChannelResponse.data.channel._id,
          type: req.body.type,
        },
      });
      rcCreateChannelResponse.data.channel["type"] =
        rcSetChannelType.data.channel.t;
    }

    // Set associated repository in channel custom fields
    await axios({
      method: "post",
        url: `${constants.rocketChatDomain}/api/v1/channels.setCustomFields`,
        headers: headers,
        data: {
          roomId: rcCreateChannelResponse.data.channel._id,
          customFields: {
            "github_repository": req.body.channel.replace("_", "/")
          }
        },
    })

    rcCreateChannelResponse.data.channel["topic"] =
      rcSetChannelTopic.data.topic;

    return res.status(200).json({
      success: true,
      data: rcCreateChannelResponse.data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};
