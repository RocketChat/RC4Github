const axios = require('axios')
const constants = require('./../config/constants')

module.exports = async function (req, res) {
    var username = req.query.username
    var authToken = req.query.authToken
    console.log("AuthToken = ", req.query.authToken)
    if(authToken)
    {
      try
      {
        const ghRepoResponse = await axios({
          method: 'get',
          url: `${constants.githubAPIDomain}/user/repos?visibility=public&affiliation=owner,organization_member`,
          headers: {
              accept: 'application/vnd.github.v3+json',
              Authorization: `token ${authToken}`
          }  
        })
    
        res.send(ghRepoResponse.data.map(repository =>
          repository.full_name
        ))
      }
      catch(err) {
        return res.status(500).json({
            success: false,
            error: `Internal Server Error ---> ${err}`
        })
    }
  }
  else
  {
    try{
      console.log("Inside private get repos")
      //Fetch access_token from github
      const requestToken = req.query.code
      const ghTokenResponse = await axios({
          method: 'post',
          url: `${constants.githubAuthURL}?client_id=${constants.githubClientID}&client_secret=${constants.githubClientSecret}&code=${requestToken}`,
          headers: {
              accept: 'application/json'
          }  
      })
      //Check for permission scopes
      const scope = ghTokenResponse.data.scope.split(",")
      if (!scope.includes('repo')){
          return res.status(401).json({
              success: false,
              error: 'More permissions are required'
          })
      }

      const ghRepoResponse = await axios({
        method: 'get',
        url: `${constants.githubAPIDomain}/user/repos?visibility=private&affiliation=owner,organization_member`,
        headers: {
            accept: 'application/vnd.github.v3+json',
            Authorization: `token ${ghTokenResponse.data.access_token}`
        }  
      })

      // console.log("Private repo response = ", ghRepoResponse)
      console.log("GitHub token = ", ghTokenResponse.data.access_token)
      res.cookie('github_authtoken', ghTokenResponse.data.access_token)
      return res.send(ghRepoResponse.data.map(repository =>
        repository.full_name
      ))
    }
    catch(err) {
      return res.status(500).json({
          success: false,
          error: `Internal Server Error ---> ${err}`
      })
    }
    
  }
}