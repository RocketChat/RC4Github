const axios = require("axios");
const githubWebhook = require("../models/githubWebhook");
const constants = require("./../config/constants");

let clients = {};

module.exports.handleGithubWebhook = async (req, res) => {
  try {
    const event = {
      action: req.body.action,
      sender: {
        username: req.body.sender.login,
      },
      resource: {
        number: req.body.number || req.body.issue.number,
        type:
          (req.body.issue && "issue") ||
          (req.body.pull_request && "pull_request"),
      },
      updated_at:
        (req.body["issue"] && req.body["issue"]["updated_at"]) ||
        req.body.pull_request.updated_at,
    };
    const webhook = await githubWebhook.findOneAndUpdate(
      { hook_id: req.get("X-GitHub-Hook-ID") },
      { $push: { events: event } }
    );
    if(webhook.events.length >= 20){
      await githubWebhook.updateOne(
        { hook_id: req.get("X-GitHub-Hook-ID") },
        { $pop: { events: -1 } }
      );
    }
    if (clients[req.get("X-GitHub-Hook-ID")])
      clients[req.get("X-GitHub-Hook-ID")].map((client) => {
        client.res.write(`data: ${JSON.stringify(event)}\n\n`);
      });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
};

module.exports.fetchGithubActivities = async (req, res) => {
  try {
    const hook = await githubWebhook.findOne({ hook_id: req.query.hook_id });
    if (!hook) {
      res.status(404).write("error: Activity Not Found\n\n");
      return res.end();
    }
    // Mandatory headers and http status to keep connection open
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-transform",
    };
    res.writeHead(200, headers);
    // Generate an id based on timestamp and save res
    // object of client connection on clients list
    // Later we'll iterate it and send updates to each client
    const clientId = Date.now();
    const newClient = {
      id: clientId,
      res,
    };
    if (!clients[req.query.hook_id]) clients[req.query.hook_id] = [];
    clients[req.query.hook_id].push(newClient);
    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on("close", () => {
      console.log(`${clientId} Connection closed`);
      clients[req.query.hook_id] = clients[req.query.hook_id].filter(
        (c) => c.id !== clientId
      );
    });
  } catch (err) {
    console.log("ERROR", err);
    return res.status(500).write("error: true");
  }
};

module.exports.fetchWebhook = async (req, res) => {
  try {
    if (!req.query.room_name) {
      return res.status(400).json({
        success: false,
        error: "Room name required as query parameter",
      });
    }

    // Check if the user is part of the room for which activity subscription is requested
    const x = await axios({
      method: "get",
      url: `${constants.rocketChatDomain}/api/v1/rooms.info?roomName=${req.query.room_name}`,
      headers: {
        "X-Auth-Token": req.cookies.rc_token || constants.rc_token,
        "X-User-Id": req.cookies.rc_uid || constants.rc_uid,
        "Content-type": "application/json",
      },
    });

    const webhook = await githubWebhook.findOne({
      channel_name: req.query.room_name,
    });
    if (!webhook) {
      return res.status(200).json({ success: true, data: {} });
    }
    return res.status(200).json({
      success: true,
      data: {
        webhook,
      },
    });
  } catch (err) {
    console.log("ERROR", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

module.exports.createGithubWebhook = async (req, res) => {
  try {
    if (req.cookies["gh_login_token"]) {
      const secret_token =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).toUpperCase().slice(2);
      const headers = {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${req.cookies["gh_login_token"]}`,
      };

      const config = {
        //This URL should be the server's public payload URL
        url: `${constants.rc4gitApiURL}/webhooks/github/events`,
        secret: secret_token,
        content_type: "json",
      };
      const ghCreateWebhookResponse = await axios({
        method: "post",
        url: `${constants.githubAPIDomain}/repos/${req.body.repository}/hooks`,
        headers: headers,
        data: {
          config: config,
          events: req.body.events,
        },
      });

      const newHook = {
        hook_id: ghCreateWebhookResponse.data.id,
        secret_token: secret_token,
        events: [],
        channel_name: req.body.channelName,
        associated_repo: req.body.repository,
        subscriptions: req.body.events,
      };

      //Store newly created webhook in our db
      hook = await githubWebhook.create(newHook);

      return res.status(201).json({
        success: true,
        data: hook.toJSON(),
      });
    } else {
      console.log("No private token");
      return res.status(403).json({
        success: false,
      });
    }
  } catch (err) {
    console.log("ERROR", err);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};

module.exports.updateGithubWebhook = async (req, res) => {
  try {
    if (req.cookies["gh_login_token"]) {
      const hook = await githubWebhook.findOne({ hook_id: req.body.hook_id });

      const secret_token = hook.secret_token;
      const headers = {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${req.cookies["gh_login_token"]}`,
      };

      const config = {
        //This URL should be the server's public payload URL
        url: `${constants.rc4gitApiURL}/webhooks/github/events`,
        secret: secret_token,
        content_type: "json",
      };
      const ghUpdateWebhookResponse = await axios({
        method: "patch",
        url: `${constants.githubAPIDomain}/repos/${req.body.repository}/hooks/${req.body.hook_id}`,
        headers: headers,
        data: {
          config: config,
          events: req.body.events,
        },
      });

      //Update stored webhook in our db
      await githubWebhook.updateOne(
        { hook_id: req.body.hook_id },
        { $set: { subscriptions: req.body.events } }
      );

      return res.status(200).json({
        success: true,
      });
    } else {
      console.log("No private token");
      return res.status(403).json({
        success: false,
      });
    }
  } catch (err) {
    console.log("ERROR", err);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};

module.exports.deleteGithubWebhook = async (req, res) => {
  try {
    if (req.cookies["gh_login_token"]) {

      const headers = {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${req.cookies["gh_login_token"]}`,
      };

      const ghDeleteWebhookResponse = await axios({
        method: "delete",
        url: `${constants.githubAPIDomain}/repos/${req.body.repository}/hooks/${req.body.hook_id}`,
        headers: headers,
      });

      //Update stored webhook in our db
      await githubWebhook.remove({ hook_id: req.body.hook_id });

      return res.status(200).json({
        success: true,
      });
    } else {
      console.log("No private token");
      return res.status(403).json({
        success: false,
      });
    }
  } catch (err) {
    console.log("ERROR", err);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error ---> ${err}`,
    });
  }
};
