import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import Cookies from "js-cookie";
import axios from "axios";
import { githubApiDomain, rcApiDomain } from "../../utils/constants";
import online from "../../images/online.png";

import "./index.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`channelinfo-tabpanel-${index}`}
      aria-labelledby={`channelinfo-tab-${index}`}
      {...other}
    >
      <Box className="tabpanel-box">
        <Typography component={"span"}>{children}</Typography>
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `channel-info-tab-${index}`,
    "aria-controls": `channel-info-tabpanel-${index}`,
  };
}

export default function ChannelInfo(props) {
  const [repoInfo, setRepoInfo] = useState({});
  const [isPrivate, setIsPrivate] = useState(false);
  const [issuesCount, setIssuesCount] = useState(0);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [channelMembers, setChannelMembers] = useState([]);
  const [openMembersDialog, setOpenMembersDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const repoURL = `https://github.com/${props.location.pathname
    .split("/")[2]
    .replace("_", "/")}`;

  useEffect(() => {
    const ghRepoInfo = async () => {
      setIsPrivate(false);
      try {
        // Fetches repository information
        const repository = props.location.pathname
          .split("/")[2]
          .replace("_", "/");
        const headers = {
          accept: "application/json",
        };
        if (Cookies.get("gh_private_repo_token")) {
          headers["Authorization"] = `token ${Cookies.get(
            "gh_private_repo_token"
          )}`;
        }
        const ghRepoInfoResponse = await axios({
          method: "get",
          url: `${githubApiDomain}/repos/${repository}`,
          headers: headers,
        });
        const ghIssuesResponse = await axios({
          method: "get",
          url: `${githubApiDomain}/repos/${repository}/issues`,
          headers: headers,
        });
        // GitHub treats both PRs and issues as issues except that PRs can be
        // distinguished by the presence of a pull_request key
        setIssuesCount(
          ghIssuesResponse.data.filter((issue) => !issue.pull_request).length
        );
        setRepoInfo(ghRepoInfoResponse.data);
      } catch (error) {
        console.log(error);
        setIsPrivate(true);
      }
    };

    const fetchChannelMembers = async () => {
      try {
        // Fetches channel members
        const channelMembersResponse = await axios({
          method: "get",
          url: `${rcApiDomain}/api/v1/channels.members`,
          headers: {
            "X-Auth-Token": Cookies.get("rc_token"),
            "X-User-Id": Cookies.get("rc_uid"),
          },
          params: {
            roomName: props.location.pathname.split("/")[2],
          },
        });
        setChannelMembers(channelMembersResponse.data.members);
      } catch (error) {
        console.log(error);
        setIsLoggedOut(true);
      }
    };
    ghRepoInfo();
    fetchChannelMembers();
  }, [props.location.pathname]);

  const [activeTab, setActiveTab] = useState(0);
  // Covers case where pathname is /channel
  const repoURL = `https://github.com/${
    props.location.pathname.split("/")[2]
      ? props.location.pathname.split("/")[2].replace("_", "/")
      : ""
  }`;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseMembersDialog = () => {
    setOpenMembersDialog(false);
  };

  return (
    <div className="channel-info-wrapper">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="channel info tabs"
        indicatorColor="none"
      >
        <Tab
          className={`channel-info-tab ${activeTab === 0 ? "active-tab" : ""}`}
          label="People"
          {...a11yProps(0)}
        />
        <Tab
          className={`channel-info-tab ${activeTab === 1 ? "active-tab" : ""}`}
          label="Repo Info"
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <div className="channel-info-wrapper">
          {!isLoggedOut ? (
            <>
              <Grid container spacing={2} className="online-users-grid">
                {channelMembers
                  .filter(
                    (user, index) => user.status === "online" && index <= 25
                  )
                  .map((user) => {
                    return (
                      <Grid
                        key={user.username}
                        item
                        xs={2}
                        className="online-users-grid-item"
                      >
                        <img className="online-status" src={online} />
                        <img
                          className="online-user-avatar"
                          src={`${rcApiDomain}/avatar/${user.username}`}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setOpenMembersDialog(true)}
              >
                See All
              </Button>
            </>
          ) : (
            <div className="user-logged-out-message">
              Please sign in to view this information.
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <div className="repo-info-wrapper">
          {!isPrivate ? (
            <>
              <div className="repo-info-header">
                <span>{repoInfo.name} </span>
              </div>
              <div className="repo-info-description">
                <div>
                  <span>{repoInfo.description}</span>
                </div>
                <div>
                  <span>
                    <i>{repoInfo.language}</i>
                  </span>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <span>by {repoInfo.owner ? repoInfo.owner.login : ""}</span>
                </div>
              </div>

              <div className="repo-info-stats">
                <span>
                  <a
                    href={`${repoURL}/issues`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{issuesCount}</strong> issues
                  </a>
                </span>
                <span>
                  <a
                    href={`${repoURL}/watchers`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{repoInfo.watchers_count}</strong> watchers
                  </a>
                </span>
                <span>
                  <a
                    href={`${repoURL}/stargazers`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{repoInfo.stargazers_count}</strong> stars
                  </a>
                </span>
              </div>
            </>
          ) : (
            <div className="private-repo-message">
              It looks like you don't have the right permissions to view
              information about this repository.
            </div>
          )}
        </div>
      </TabPanel>
      <Dialog
        open={openMembersDialog}
        keepMounted
        onClose={handleCloseMembersDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth={true}
        scroll="paper"
      >
        <DialogTitle>Channel Members</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="channel-member-grid">
            {channelMembers.map((user) => {
              return (
                <Grid
                  key={user.username}
                  item
                  md={4}
                  className="channel-member-grid-item"
                >
                  <img
                    style={{ width: "30px" }}
                    src={`${rcApiDomain}/avatar/${user.username}`}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "5px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>{user.name}</span>
                    <span style={{ fontSize: "x-small" }}>
                      @{user.username}
                    </span>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
