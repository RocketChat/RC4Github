const crypto = require("crypto");
const githubWebhook = require("../models/githubWebhook");
const sigHeaderName = "X-Hub-Signature-256";

module.exports.verifyGithubWebhook = async (req, res, next) => {
  try{
    const payload = JSON.stringify(req.body);
    if (!payload) {
      return next("Request body empty");
    }

    const webhook = await githubWebhook.findOne({
      hook_id: req.get("X-GitHub-Hook-ID"),
    });
    const secret = webhook.secret_token;

    const sig = req.get(sigHeaderName) || "";
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      "sha256=" + hmac.update(payload).digest("hex"),
      "utf8"
    );
    const checksum = Buffer.from(sig, "utf8");
    if (
      checksum.length !== digest.length ||
      !crypto.timingSafeEqual(digest, checksum)
    ) {
      return next(
        `Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`
      );
    }
    return next();
  } catch(err) {
    console.log(err)
    return next(err);
  }
};

module.exports.handleGithubWebhookVerificationError = (err, req, res, next) => {
  if (err) console.error(err);
  res.status(403).send("Request body was not signed or verification failed");
};