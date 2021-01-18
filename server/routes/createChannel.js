var axios = require('axios');
var express = require('express');
var router = express.Router();

const headers = {
    'X-Auth-Token': '1c8Ps-k3-I556JRmsE2FlnbfNgtSifFWn6pchDa5kY6',
    'X-User-Id': 'BtvdqhXyghhxbvQvt',
    'Content-type': 'application/json'
}

router.post('/', function(req, res, next) {
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
});

module.exports = router;