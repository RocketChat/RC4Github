const { rocketChatDomain, rc_uid, rc_token } = require("../config/constants");
const axios = require('axios');
module.exports.fetchStats = async (req, res) => {
    try {
        const RCStats = await axios({
          method: "get",
          url: `${rocketChatDomain}/api/v1/statistics?refresh=true`,
          headers: {
            "Content-type": "application/json",
            "X-Auth-Token": `${rc_token}`,
            "X-User-Id": `${rc_uid}`,
          },
        });
        const stats = {
          users: RCStats.data.totalUsers,
          onlineUsers: RCStats.data.onlineUsers,
          totalMessages: RCStats.data.totalMessages,
        };
        return res.status(200).json({success: true, data: stats});
    } catch(err) {
        console.log("ERROR --->", err);
        return res.status(500).json({success: false, error: err});
    }
}