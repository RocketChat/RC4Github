const axios = require('axios')

module.exports = async function (req, res) {
    
    const headers = {
        'X-Auth-Token': 'rio45vW-YxOe2JiT3xW364LM3iec1VrhaeXPuruEW6r',
        'X-User-Id': 'BtvdqhXyghhxbvQvt',
        'Content-type': 'application/json'
    }

    var channel = req.query.channel
    axios({
        method: 'post',
        url: 'http://localhost:3000/api/v1/channels.create',
        data: { 'name': channel },
        headers: headers
    })
    .then(response => 
        res.send('Created Channel'))
    .catch(err => res.send(err));
}