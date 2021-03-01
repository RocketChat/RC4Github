const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const axios = require("axios");
const crypto = require("crypto");
const constants = require("./../config/constants");
const jsonfile = require("jsonfile");

const inconsistentUsersPath = __dirname + "/inconsistentUsers.json";

module.exports.createToken = async function (req, res) {
  try {
    //Fetch access_token from github
    const requestToken = req.body.code;
    const ghTokenResponse = await axios({
      method: "post",
      url: `${constants.githubAuthURL}?client_id=${constants.githubClientID}&client_secret=${constants.githubClientSecret}&code=${requestToken}`,
      headers: {
        accept: "application/json",
      },
    });
    //Check for permission scopes
    const scope = ghTokenResponse.data.scope.split(",");
    if (!scope.includes("read:org") || !scope.includes("user:email")) {
      return res.status(401).json({
        success: false,
        error: "More permissions are required",
      });
    }

    //Fetch user email from github
    const ghUserEmailResponse = await axios({
      method: "get",
      url: `${constants.githubAPIDomain}/user/emails`,
      headers: {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${ghTokenResponse.data.access_token}`,
      },
    });

    //Check if the user exists in our db
    let user = await User.findOne({ email: ghUserEmailResponse.data[0].email });
    // userBio acts both as a flag to see if it is a sign up and to get the user bio
    let userBio = "";
    if (!user) {
      //Create a new user if the user does not exist in our db
      const newUser = {
        email: ghUserEmailResponse.data[0].email,
      };
      //Fetch user info from github
      const ghUserResponse = await axios({
        method: "get",
        url: `${constants.githubAPIDomain}/user`,
        headers: {
          accept: "application/vnd.github.v3+json",
          Authorization: `token ${ghTokenResponse.data.access_token}`,
        },
      });
      newUser["name"] = ghUserResponse.data.name || ghUserResponse.data.login;
      newUser["username"] = `${ghUserResponse.data.login}_github`;
      newUser["avatarUrl"] = ghUserResponse.data.avatar_url;
      userBio = ghUserResponse.data.bio;

      /*
                In order to handle a case when user tries signing in gets created on RC but fails get stored in our db due to some error
                To keep it consistent with RC we store the (user-email,encrypted-rcPassword) pair in our fs so that it can be used
                to store later in our db
            */
      let inconsistentUsers = jsonfile.readFileSync(inconsistentUsersPath);
      let rcPassword = inconsistentUsers[newUser.email];

      if (rcPassword) {
        //If the user already exists on RC
        newUser["rcPassword"] = rcPassword;
        delete inconsistentUsers[newUser.email];
        jsonfile.writeFileSync(inconsistentUsersPath, inconsistentUsers);
      } else {
        //Generate RC password and create user on RC
        rcPassword =
          Math.random().toString(36).slice(2) +
          Math.random().toString(36).toUpperCase().slice(2);
        //Encrypt RC password
        const cipher = crypto.createCipheriv(
          constants.algorithm,
          constants.key,
          constants.iv.toString("hex").slice(0, 16)
        );
        encryptedRCPassword =
          cipher.update(rcPassword, "utf8", "hex") + cipher.final("hex");
        await axios({
          method: "post",
          url: `${constants.rocketChatDomain}/api/v1/users.register`,
          headers: {
            "Content-type": "application/json",
          },
          data: `{
                        "name": "${newUser.name}",
                        "email": "${newUser.username}@rc4git.com",
                        "pass": "${rcPassword}",
                        "username": "${newUser.username}_rc4git"
                    }`,
        });
        newUser["rcPassword"] = encryptedRCPassword;
      }

      try {
        //Store user in our db
        user = await User.create(newUser);
      } catch (err) {
        inconsistentUsers[newUser.email] = rcPassword;
        jsonfile.writeFileSync(inconsistentUsersPath, inconsistentUsers);
        throw err;
      }
    }
    //Decrypt RC Password to login on RC and genearte rc_uid and rc_token
    const decipher = crypto.createDecipheriv(
      constants.algorithm,
      constants.key,
      constants.iv.toString("hex").slice(0, 16)
    );
    const rcLoginUserResponse = await axios({
      method: "post",
      url: `${constants.rocketChatDomain}/api/v1/login`,
      headers: {
        "Content-type": "application/json",
      },
      data: `{
                "password": "${
                  decipher.update(user.rcPassword, "hex", "utf8") +
                  decipher.final("utf8")
                }",
                "user": "${user.username}_rc4git"
            }`,
    });

    //Create a user community for newly signed up user
    if (userBio !== "") {
      const headers = {
        "X-Auth-Token": rcLoginUserResponse.data.data.authToken,
        "X-User-Id": rcLoginUserResponse.data.data.userId,
        "Content-type": "application/json",
      };

      //Create a user community on signup
      const rcCreateChannelResponse = await axios({
        method: "post",
        url: `${constants.rocketChatDomain}/api/v1/channels.create`,
        headers: headers,
        data: {
          name: user.username.slice(0, -7).concat("_community"),
        },
      });

      await axios({
        method: "post",
        url: `${constants.rocketChatDomain}/api/v1/channels.setTopic`,
        headers: headers,
        data: {
          roomId: rcCreateChannelResponse.data.channel._id,
          topic: `GitHub: https://github.com/${user.username.slice(0, -7)}`,
        },
      });
      
      // User bio fetched from GitHub can either be null or a non-empty string
      let description = (userBio ? userBio : "").concat(`

-----
Embed this channel
<pre><code>&lt;a&nbsp;href=&quot;${constants.rc4gitDomain}/channel/${user.username.slice(0, -7).concat("_community")}&quot;&gt;
&lt;img&nbsp;src=&quot;${constants.rocketChatDomain}/images/join-chat.svg&quot;/&gt;
&lt;/a&gt;</code></pre>
`);

      await axios({
        method: "post",
        url: `${constants.rocketChatDomain}/api/v1/channels.setDescription`,
        headers: headers,
        data: {
          roomId: rcCreateChannelResponse.data.channel._id,
          description: description,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        rc_token: rcLoginUserResponse.data.data.authToken,
        rc_uid: rcLoginUserResponse.data.data.userId,
        rc4git_token: jwt.sign(user.toJSON(), constants.jwtSecret),
        gh_login_token: ghTokenResponse.data.access_token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};

module.exports.upgradeAccess = async (req, res) => {
  try {
    //Fetch access_token from github
    const requestToken = req.body.code;
    const ghTokenResponse = await axios({
      method: "post",
      url: `${constants.githubAuthURL}?client_id=${constants.githubPrivateRepoAccessClientID}&client_secret=${constants.githubPrivateRepoAccessClientSecret}&code=${requestToken}`,
      headers: {
        accept: "application/json",
      },
    });
    //Check for permission scopes
    const scope = ghTokenResponse.data.scope.split(",");
    if (!scope.includes("repo")) {
      return res.status(401).json({
        success: false,
        error: "Private Repo Access permissions are required",
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        gh_private_repo_token: ghTokenResponse.data.access_token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};

module.exports.sso = (req, res) => {
  try {
    if (req.cookies["rc4git_token"] && req.cookies["rc_token"]) {
      return res.status(200).json({
        loginToken: req.cookies["rc_token"],
      });
    }
    return res.status(401);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const logoutResponse = await axios({
      method: "post",
      url: `${constants.rocketChatDomain}/api/v1/logout`,
      headers: {
        "Content-type": "application/json",
        "X-Auth-Token": req.cookies["rc_token"],
        "X-User-Id": req.cookies["rc_uid"],
      },
    });
    req.logout();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};
