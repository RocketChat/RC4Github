import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";

import "./index.css";

export default function ConfigureWebhook(props) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([
    "issues",
    "pull_request",
  ]);

  const allEvents = [
    "Issues",
    "Issue Comment",
    "Pull Request",
    "Pull Request Review Comment",
  ];

  useEffect(() => {
    if (props.webhookId) {
      setSelectedEvents(props.webhookSubscriptions);
    }
  }, [props.webhookId]);

  const handleCreateWebhook = async () => {
    try {
      setLoading(true);
      const ghCreateWebhookResponse = await axios({
        method: "post",
        url: `/api/webhooks/github`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          channelName: props.location.pathname.split("/")[2],
          repository: props.location.pathname.split("/")[2].replace("_", "/"),
          events: selectedEvents,
        },
        withCredentials: true,
      });
      setLoading(false);
      props.setSnackbar("success", "Webhook created successfully!");
      props.setOpenWebhookDialog(false);
    } catch (error) {
      console.log(error.response.data.errors);
      setLoading(false);
      props.setSnackbar("error", error.response.data.errors[0].message);
    }
  };

  const handleUpdateWebhook = async () => {
    try {
      setLoading(true);
      const ghUpdateWebhookResponse = await axios({
        method: "patch",
        url: `/api/webhooks/github`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          hook_id: props.webhookId,
          repository: props.location.pathname.split("/")[2].replace("_", "/"),
          events: selectedEvents,
        },
        withCredentials: true,
      });
      setLoading(false);
      props.setSnackbar("success", "Webhook updated successfully!");
      props.setOpenWebhookDialog(false);
    } catch (error) {
      console.log(error.response.data.errors);
      setLoading(false);
      props.setSnackbar("error", error.response.data.errors[0].message);
    }
  };

  const handleDeleteWebhook = async () => {
    try {
      setDeleteLoading(true);
      const ghDeleteWebhookResponse = await axios({
        method: "delete",
        url: `/api/webhooks/github`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          hook_id: props.webhookId,
          repository: props.location.pathname.split("/")[2].replace("_", "/"),
        },
        withCredentials: true,
      });
      setDeleteLoading(false);
      props.setSnackbar("success", "Webhook deleted successfully!");
      props.setOpenWebhookDialog(false);
    } catch (error) {
      console.log(error.response.data.errors);
      setDeleteLoading(false);
      props.setSnackbar("error", error.response.data.errors[0].message);
    }
  };

  return (
    <>
      <Dialog
        open={true}
        keepMounted
        onClose={() => props.setOpenWebhookDialog(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>
          <p style={{ fontSize: "20px" }}>Configure Webhook</p>
          <p style={{ fontSize: "15px", color: "#8e9299" }}>
            Webhooks let you see events on your repository as they happen.
          </p>
        </DialogTitle>
        <DialogContent>
          <div>
            <p>Select the GitHub events that you would like to subscribe to.</p>
            {allEvents.map((event) => {
              return (
                <Chip
                  label={event}
                  color="primary"
                  variant={
                    selectedEvents.includes(
                      event.toLowerCase().replace(/ /g, "_")
                    )
                      ? "default"
                      : "outlined"
                  }
                  style={{ marginRight: "5px", marginBottom: "10px" }}
                  onClick={() => {
                    if (
                      selectedEvents.includes(
                        event.toLowerCase().replace(/ /g, "_")
                      )
                    ) {
                      setSelectedEvents(
                        selectedEvents.filter(
                          (selectedEvent) =>
                            selectedEvent !==
                            event.toLowerCase().replace(/ /g, "_")
                        )
                      );
                    } else {
                      setSelectedEvents([
                        ...selectedEvents,
                        event.toLowerCase().replace(/ /g, "_"),
                      ]);
                    }
                  }}
                />
              );
            })}
            <br />
            <br />
            <p>Webhook Repository</p>
            <p style={{ color: "#8e9299" }}>
              {props.webhookId ? "The" : "A"} webhook for the repository{" "}
              <strong>
                {props.location.pathname.split("/")[2]
                  ? props.location.pathname.split("/")[2].replace("_", "/")
                  : ""}
              </strong>{" "}
              would be {props.webhookId ? "updated" : "created"}
            </p>
            <br />
            <br />
            {props.webhookId ? (
              <>
                <Button
                  disabled={!selectedEvents.length || loading}
                  onClick={handleUpdateWebhook}
                  style={{ marginBottom: "10px", marginRight: "10px" }}
                  variant="contained"
                  color="primary"
                  startIcon={
                    loading && <CircularProgress size={14} color="secondary" />
                  }
                >
                  {loading ? "Updating" : "Update"}
                </Button>
                <Button
                  disabled={deleteLoading}
                  onClick={handleDeleteWebhook}
                  style={{ marginBottom: "10px" }}
                  variant="contained"
                  color="secondary"
                  startIcon={
                    deleteLoading && (
                      <CircularProgress size={14} color="secondary" />
                    )
                  }
                >
                  {deleteLoading ? "Deleting" : "Delete"}
                </Button>
              </>
            ) : (
              <Button
                disabled={!selectedEvents.length || loading}
                onClick={handleCreateWebhook}
                style={{ marginBottom: "10px" }}
                variant="contained"
                color="primary"
                startIcon={
                  loading && <CircularProgress size={14} color="secondary" />
                }
              >
                {loading ? "Creating" : "Create"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
