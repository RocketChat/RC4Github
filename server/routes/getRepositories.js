var express = require('express');
var axios = require('axios')
var router = express.Router();

router.get('/', function(req, res, next) {
    var username = req.query.username
    axios.get(`https://api.github.com/users/${username}/repos`)
       .then(response => 
           res.send(response.data.map(repository =>
            repository.name
     )))
       .catch(err => res.send(err));
});

module.exports = router;