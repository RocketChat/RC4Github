const axios = require('axios')

module.exports = async function (req, res) {

    try
    {
        const headers = {
            'X-Auth-Token': req.query.rc_token,
            'X-User-Id': req.query.rc_uid,
            'Content-type': 'application/json'
        }

        const rcUserInfoResponse = await axios({
            method: 'get',
            url: `http://localhost:3000/api/v1/users.info?userId=${req.query.rc_uid}&fields={"userRooms": 1}`,
            headers: headers,
        })
    
        return res.status(200).json({
            success: true,
            data: rcUserInfoResponse.data,
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