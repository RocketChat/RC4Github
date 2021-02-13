const mongoose = require("mongoose");

const githubWebhookSchema = mongoose.Schema(
  {
    hook_id: {
      type: String,
      unique: true,
      required: true,
    },
    secret_token: {
      type: String,
      required: true,
    },
    events: [
      {
        action: {
          type: String,
          required: true,
        },
        resource: {
          type: Object,
          required: true,
        },
        updated_at: {
          type: String,
          required: true,
        },
        sender: {
          type: Object,
          required: true,
        },
      },
    ],
    channel_name: {
      type: String,
      required: true
    },
    associated_repo: {
      type: String,
      required: true
    },
    subscriptions: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const githubWebhook = mongoose.model("GithubWebhook", githubWebhookSchema);
module.exports = githubWebhook;
