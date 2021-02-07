const axios = require('axios')
const constants = require('./../config/constants')

module.exports = async function (req, res) {

    try
    {
        const headers = {
            'X-Auth-Token': req.body.rc_token,
            'X-User-Id': req.body.rc_uid,
            'Content-type': 'application/json'
        }
    
        const channel = req.body.channel
        const members = req.body.members
        const topic = req.body.topic
        const type = req.body.type
    
        const rcCreateChannelResponse = await axios({
            method: 'post',
            url: `${constants.rocketChatAPIURL}/channels.create`,
            headers: headers,
            data: { 
                'name': channel,
                'members': members 
            },
        })

        const rcSetChannelTopic = await axios({
            method: 'post',
            url: `${constants.rocketChatAPIURL}/channels.setTopic`,
            headers: headers,
            data: { 
                'roomId': rcCreateChannelResponse.data.channel._id,
                'topic': topic 
            },
        })

        if(type === "p")
        {
            const rcSetChannelType = await axios({
                method: 'post',
                url: `${constants.rocketChatAPIURL}/channels.setType`,
                headers: headers,
                data: { 
                    'roomId': rcCreateChannelResponse.data.channel._id,
                    'type': type 
                },
            })
            rcCreateChannelResponse.data.channel['type'] = rcSetChannelType.data.channel.t
        }
    
        rcCreateChannelResponse.data.channel['topic'] = rcSetChannelTopic.data.topic

        return res.status(200).json({
            success: true,
            data: rcCreateChannelResponse.data,
          });
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ---> ${err}`
        })
    }
}