import React, { Component } from "react";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Button,
  TextField,
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";
import RCSwitch from "../RCSwitch";
import Cookies from "js-cookie";
import {
  rcApiDomain,
  rc4gitDomain,
  githubAppSlug,
} from "../../utils/constants";
import EmbedBadgeDialog from "../EmbedBadgeDialog";

import "./index.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class CreateChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repositories: [],
      publicChannel: true,
      loading: false,
      channel: null,
      showEmbedBadgeDialog: false,
      openCreateChannelDialog: true,
    };
  }

  componentDidMount() {
    this.handleClickChannelDialog();
  }

  handleClickChannelDialog = async () => {
    const getAllInstallations = await axios({
      method: "get",
      url: `https://api.github.com/user/installations`,
      headers: {
        accept: "application/json",
        Authorization: `token ${Cookies.get("gh_login_token")}`,
      },
      params: {
        per_page: 100,
      },
    });
    let repositories = [];
    for (const installation of getAllInstallations.data.installations) {
      const fetchReposResponse = await axios({
        method: "get",
        url: `https://api.github.com/user/installations/${installation.id}/repositories`,
        headers: {
          accept: "application/json",
          Authorization: `token ${Cookies.get("gh_login_token")}`,
        },
        params: {
          per_page: 100,
        },
      });
      fetchReposResponse.data.repositories.forEach((repo) => {
        repositories.push(repo.full_name);
      });
    }

    this.setState({ repositories });
  };

  handleCreateChannel = async () => {
    const { channel, publicChannel } = this.state;
    const { setSnackbar } = this.props;
    const authToken = Cookies.get("gh_login_token");
    let collaborators = [],
      description = "";
    this.setState({ loading: true });
    //Populate collaborators for the repo
    try {
      const ghCollaboratorsResponse = await axios({
        method: "get",
        url: `https://api.github.com/repos/${channel}/collaborators`,
        headers: {
          accept: "application/json",
          Authorization: `token ${authToken}`,
        },
        params: {
          per_page: 100,
        },
      });
      ghCollaboratorsResponse.data.map((member) =>
        collaborators.push(member.login)
      );
      const ghRepoResponse = await axios({
        method: "get",
        url: `https://api.github.com/repos/${channel}`,
        headers: {
          accept: "application/json",
          Authorization: `token ${authToken}`,
        },
      });

      description = ghRepoResponse.data.description || "";

      const rcCreateChannelResponse = await axios({
        method: "post",
        url: `/api/createChannel`,
        data: {
          rc_token: Cookies.get("rc_token"),
          rc_uid: Cookies.get("rc_uid"),
          channel: channel.replace("/", "_"),
          members: collaborators,
          topic: `GitHub: https://github.com/${channel}`,
          type: publicChannel ? "c" : "p",
        },
      });
      if (publicChannel) {
        let room = rcCreateChannelResponse.data.data.channel;
        //Add embeddable code for room to description
        description = description.concat(`

-----
Embed this room
<pre><code>&lt;a&nbsp;href=&quot;${rc4gitDomain}/channel/${room.name}&quot;&gt;
&lt;img&nbsp;src=&quot;${rcApiDomain}/images/join-chat.svg&quot;/&gt;
&lt;/a&gt;</code></pre>
`);
        await axios({
          method: "post",
          url: `${rcApiDomain}/api/v1/${
            publicChannel ? "channels" : "groups"
          }.setDescription`,
          headers: {
            "X-Auth-Token": Cookies.get("rc_token"),
            "X-User-Id": Cookies.get("rc_uid"),
            "Content-type": "application/json",
          },
          data: {
            roomId: room._id,
            description: description,
          },
        });
        this.setState({
          loading: false,
          openCreateChannelDialog: false,
          showEmbedBadgeDialog: true,
        });
      } else {
        this.setState({
          loading: false,
          openCreateChannelDialog: false,
        });
      }
      setSnackbar(true, "success", "Room created successfully!");
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      setSnackbar(true, "error", "Error Creating Room!");
    }
  };

  render() {
    const {
      repositories,
      publicChannel,
      channel,
      loading,
      openCreateChannelDialog,
      showEmbedBadgeDialog,
    } = this.state;
    const { setSnackbar, handleEndCreateChannel } = this.props;

    return (
      <div className="create-channel-wrapper">
        <Dialog
          open={openCreateChannelDialog}
          keepMounted
          onClose={handleEndCreateChannel}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          TransitionComponent={Transition}
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogTitle>Create Room</DialogTitle>
          <DialogContent>
            <p className="create-dialog-description">
              Rooms are where your teams communicate.
            </p>
            <div>
              <br />
              <p className="repository-select-label">
                Select Repository{" "}
                <a
                  href={`https://github.com/apps/${githubAppSlug}/installations/new`}
                  className="install-github-app-link"
                >
                  Add/Remove Repositories
                </a>
              </p>
              <Autocomplete
                id="combo-box-repo"
                fullWidth
                options={repositories.sort()}
                renderOption={(option) => option.split("/")[1]}
                getOptionLabel={(option) => option}
                groupBy={(option) => option.split("/")[0]}
                onChange={(event, value) => {
                  this.setState({ channel: value });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Repositories"
                    variant="outlined"
                  />
                )}
              />
              <br />
              {channel && (
                <>
                  <p className="create-dialog-description">
                    Your room would be created as{" "}
                    <strong>{channel.replace("/", "_")}</strong>
                  </p>
                </>
              )}
              <div className="form-switch">
                <p>Public Room</p>
                <FormControlLabel
                  className="form-control-label"
                  control={
                    <RCSwitch
                      checked={publicChannel}
                      onChange={() =>
                        this.setState({ publicChannel: !publicChannel })
                      }
                      name="publicChannel"
                    />
                  }
                />
              </div>
              <p className="create-dialog-description">
                {publicChannel
                  ? "Everyone can access this room."
                  : "Just invited people can access this room."}
              </p>
              <br />
              <p>Note:</p>
              {publicChannel && (
                <p className="create-dialog-description">
                  Public room for a private repository may expose the metadata
                  of that repository.
                </p>
              )}
              <p className="create-dialog-description">
                All the repository collaborators who are RCforCommunity users as
                well will automatically get added in the chat room.
              </p>
              <br />
              <Button
                className="create-button"
                disabled={!channel || loading}
                onClick={this.handleCreateChannel}
                variant="contained"
                color="primary"
                startIcon={
                  loading && <CircularProgress size={14} color="secondary" />
                }
              >
                {loading ? "Creating" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {showEmbedBadgeDialog && (
          <EmbedBadgeDialog
            channelURL={`${rc4gitDomain}/channel/${channel.replace("/", "_")}`}
            setSnackbar={setSnackbar}
            endCreate={handleEndCreateChannel}
          />
        )}
      </div>
    );
  }
}
