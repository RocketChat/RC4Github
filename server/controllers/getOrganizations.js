const axios = require('axios')
const constants = require('./../config/constants')

module.exports = async function (req, res) {
    var authToken = req.query.authToken
    console.log("AuthToken = ", authToken)
    if(!authToken)
    {
        return res.status(401).json({
            success: false,
            error: 'Authtoken required'
        })
    }
    try
    {
        const ghOrgResponse = await axios({
            method: 'get',
            url: `${constants.githubAPIDomain}/user/orgs`,
            headers: {
                accept: 'application/vnd.github.v3+json',
                Authorization: `token ${authToken}`
            }  
        })

        console.log("Organizations = ", ghOrgResponse.data)
        res.send(ghOrgResponse.data)
    }
    catch(err) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ---> ${err}`
        })
    }
  }