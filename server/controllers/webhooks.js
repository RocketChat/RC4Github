const githubWebhook = require("../models/githubWebhook");

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
        await githubWebhook.updateOne(
          { hook_id: req.get("X-GitHub-Hook-ID") },
          { $push: { events: event } }
        );
        if (clients[req.get("X-GitHub-Hook-ID")])
          clients[req.get("X-GitHub-Hook-ID")].map((client) => {
            client.res.write(`data: ${JSON.stringify(event)}\n\n`);
          });
        return res.status(200).json({ success: true });
    } catch(err) {
        console.log(req.body);
        return res.status(500).json({success: false, error: err})
    }
};

module.exports.fetchGithubActivities = async (req, res) => {
  try {
    // TODO Check if the user is part of the room for which activity subscription is requested
    const hook = await githubWebhook.findOne({ hook_id: req.query.hook_id });
    if (!hook) {
      res.status(404).write('error: Activity Not Found\n\n');
      return res.end();
    }
    // Mandatory headers and http status to keep connection open
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    res.write(`data: ${JSON.stringify(hook.events)}\n\n`);
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
  try{
    if (!req.query.room_name) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Room name required as query parameter",
        });
    }
    const webhook = await githubWebhook.findOne({
      channel_name: req.query.room_name,
    });
    if(!webhook){
      return res.status(200).json({success: true, data: {}})
    }
    return res.status(200).json({success: true, data: {
      hook_id: webhook.hook_id
    }})
  } catch(err){
    console.log("ERROR", err);
    return res.status(500).json({success: false, error: "Internal Server Error"});
  }
};