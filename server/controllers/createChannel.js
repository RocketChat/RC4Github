const axios = require('axios')

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
        const description = req.body.description
        const topic = req.body.topic
        const type = req.body.type
    
        const rcCreateChannelResponse = await axios({
            method: 'post',
            url: 'http://localhost:3000/api/v1/channels.create',
            headers: headers,
            data: { 
                'name': channel,
                'members': members 
            },
        })

        const rcSetChannelDescription = await axios({
            method: 'post',
            url: 'http://localhost:3000/api/v1/channels.setDescription',
            headers: headers,
            data: { 
                'roomId': rcCreateChannelResponse.data.channel._id,
                'description': description 
            },
        })

        const rcSetChannelTopic = await axios({
            method: 'post',
            url: 'http://localhost:3000/api/v1/channels.setTopic',
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
                url: 'http://localhost:3000/api/v1/channels.setType',
                headers: headers,
                data: { 
                    'roomId': rcCreateChannelResponse.data.channel._id,
                    'type': type 
                },
            })
            rcCreateChannelResponse.data.channel['type'] = rcSetChannelType.data.channel.t
        }
    
        rcCreateChannelResponse.data.channel['description'] = rcSetChannelDescription.data.description
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