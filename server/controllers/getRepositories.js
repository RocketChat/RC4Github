const axios = require('axios')

module.exports = async function (req, res) {
    var username = req.query.username
    axios.get(`https://api.github.com/users/${username}/repos`)
       .then(response => 
           res.send(response.data.map(repository =>
            repository.name
     )))
       .catch(err => res.send(err));
}