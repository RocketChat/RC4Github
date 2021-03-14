const { rocketChatDomain, rc_uid, rc_token } = require("../config/constants");
const axios = require("axios");
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
