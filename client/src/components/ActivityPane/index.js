import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ActivityItem from "./../ActivityItem";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import ConfigureWebhook from "../ConfigureWebhook";
import { githubApiDomain } from "../../utils/constants";
import { IoSettingsOutline } from "react-icons/io5";

import "./index.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ActivityPane(props) {
  const [webhookId, setWebhookId] = useState(null);
  const [webhookSubscriptions, setWebhookSubscriptions] = useState([]);
  const [events, setEvents] = useState([]);
  const [openWebhookDialog, setOpenWebhookDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");
  const [isRepoOwner, setIsRepoOwner] = useState(false);

  const { authState } = props;

  useEffect(() => {
    fetch(`/api/webhooks?room_name=${props.location.pathname.split("/")[2]}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("rc4git_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.webhook) {
          setWebhookId(data.data.webhook.hook_id);
          /* On setting state directly as array setWebhookSubscriptions reducer
         sets state repeatedly due to its inability to compare previous and 
        new values of webhookSubscriptions array leading to useEffect being called 
        indefinitely. We therefore check for previous equality of webhookSubscriptions ourselves. */

          // "if" executes if length doesn't match OR arrays are not equal.
          if (
            webhookSubscriptions.length !==
              data.data.webhook.subscriptions.length ||
            data.data.webhook.subscriptions.forEach((i, subscription) => {
              if (webhookSubscriptions[i] !== subscription) {
                return false;
              }
            })
          )
            setWebhookSubscriptions(data.data.webhook.subscriptions);
          const events = data.data.webhook.events;
          events.sort((a, b) => {
            if (a.updated_at < b.updated_at) {
              return 1;
            }
            if (a.updated_at > b.updated_at) {
              return -1;
            }
            return 0;
          });
          setEvents(events);
        } else {
          setWebhookId(null);
        }
      })
      .catch((error) => console.log(error));

    const checkIfUserIsOwner = async () => {
      try {
        // Checks if the current user is also the owner of the repo
        if (authState.user.username) {
          const repository = props.location.pathname
            .split("/")[2]
            .replace("_", "/");
          const authToken = Cookies.get("gh_login_token");
          const ghRepoResponse = await axios({
            method: "get",
            url: `${githubApiDomain}/repos/${repository}`,
            headers: {
              accept: "application/vnd.github.v3+json",
              Authorization: `token ${authToken}`,
            },
          });

          setIsRepoOwner(ghRepoResponse.data.permissions.admin);
        }
      } catch (error) {
        console.log(error);
        setIsRepoOwner(false);
      }
    };
    checkIfUserIsOwner();
    // eslint-disable-next-line
  }, [props.location.pathname]);
  useEffect(() => {
    if (webhookId) {
      let activityConnection = new EventSource(
        `/api/activities/github?hook_id=${webhookId}`,
        { withCredentials: true }
      );
      activityConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setEvents((events) => [data, ...events]);
      };
      return () => {
        activityConnection.close();
      };
    }
  }, [webhookId]);

  const setSnackbar = (snackbarSeverity, snackbarText) => {
    setSnackbarSeverity(snackbarSeverity);
    setSnackbarText(snackbarText);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div className="activity-pane-wrapper">
      <hr className="activity-pane-divider" />
      <div className="activity-pane-header">
        <span>Activity </span>
        {authState.isLoggedIn && isRepoOwner && (
          <div className="configure-webhooks-control">
            <IoSettingsOutline
              className="configure-webhooks-icon"
              onClick={() => setOpenWebhookDialog(true)}
            />
          </div>
        )}
      </div>
      <div className="activity-pane-body">
        {!webhookId && (
          <div className="configure-webhook-message">
            You can configure your GitHub Webhook by clicking on the configure
            button <IoSettingsOutline /> above to receive realtime updates about
            your GitHub repository here.
          </div>
        )}
        {webhookId &&
          events.map((event, index) => {
            return (
              <ActivityItem
                key={index}
                event={event}
                repo={props.location.pathname.split("/")[2].replace("_", "/")}
              />
            );
          })}
      </div>
      {openWebhookDialog && (
        <ConfigureWebhook
          setSnackbar={setSnackbar}
          setOpenWebhookDialog={setOpenWebhookDialog}
          webhookId={webhookId}
          webhookSubscriptions={webhookSubscriptions}
          setWebhookSubscriptions={setWebhookSubscriptions}
          setWebhookId={setWebhookId}
          setEvents={setEvents}
          {...props}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
}
