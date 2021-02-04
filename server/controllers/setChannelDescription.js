const axios = require('axios')

module.exports = async function (req, res) {

    try
    {
        const headers = {
            'X-Auth-Token': req.body.rc_token,
            'X-User-Id': req.body.rc_uid,
            'Content-type': 'application/json'
        }
    
        const roomId = req.body.roomId
        const description = req.body.description

        const rcSetChannelDescription = await axios({
            method: 'post',
            url: 'http://localhost:3000/api/v1/channels.setDescription',
            headers: headers,
            data: { 
                'roomId': roomId,
                'description': description 
            },
        })

        return res.status(200).json({
            success: true,
            data: rcSetChannelDescription.data,
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