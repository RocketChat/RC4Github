import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ActivityItem from "./../ActivityItem";
import MuiAlert from "@material-ui/lab/Alert";
import { Button, Snackbar } from "@material-ui/core";
import ConfigureWebhook from "../ConfigureWebhook";
import { githubPrivateRepoAccessClientID } from "../../utils/constants";

import "./index.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ActivityPane(props) {
  const [webhookId, setWebhookId] = useState(null);
  const [events, setEvents] = useState([]);
  const [openWebhookDialog, setOpenWebhookDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");

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
        if(data.data.webhook){
          setWebhookId(data.data.webhook.hook_id);
          const events = data.data.webhook.events;
          events.sort((a, b) => {
            if(a.updated_at < b.updated_at){
              return 1;
            }
            if(a.updated_at > b.updated_at){
              return -1;
            }
            return 0;
          })
          setEvents(events);
        } else {
          setWebhookId(null);
        }
      })
      .catch((error) => console.log(error));
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

  const handleClickConfigureWebhooks = async () => {
    if (!Cookies.get("gh_private_repo_token")) {
      document.getElementById("webhook-scope-link").click();
    } else {
      setOpenWebhookDialog(true);
    }
  };

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
      <div className="activity-pane-header">
        <span>Activity </span>
      </div>
      <hr className="left-sidebar-divider"></hr>
      <div className="activity-pane-body">
        {webhookId &&
          events.map((event) => {
            return (
              <ActivityItem
                key={event._id}
                event={event}
                repo={props.location.pathname.split("/")[2].replace("_", "/")}
              />
            );
          })}
        {!webhookId && (
          <Button
            style={{
              display: props.location.pathname.split("/")[2] ? "block" : "none",
            }}
            onClick={handleClickConfigureWebhooks}
            variant="contained"
            color="primary"
          >
            Configure Webhooks
          </Button>
        )}
      </div>
      <a
        id="webhook-scope-link"
        href={`https://github.com/login/oauth/authorize?scope=repo&client_id=${githubPrivateRepoAccessClientID}`}
      />
      {openWebhookDialog && (
        <ConfigureWebhook
          setSnackbar={setSnackbar}
          setOpenWebhookDialog={setOpenWebhookDialog}
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
