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
      id={`roominfo-tabpanel-${index}`}
      aria-labelledby={`roominfo-tab-${index}`}
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
    id: `roominfo-tab-${index}`,
    "aria-controls": `roominfo-tabpanel-${index}`,
  };
}

export default function RoomInfo(props) {
  const [repoInfo, setRepoInfo] = useState({});
  const [isPrivate, setIsPrivate] = useState(false);
  const [issuesCount] = useState(0);
  const [isNotAccessible, setIsNotAccessible] = useState(false);
  const [roomMembers, setRoomMembers] = useState([]);
  const [openMembersDialog, setOpenMembersDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  // Covers case where pathname is /channel or /group
  const repoURL = `https://github.com/${
    props.location.pathname.split("/")[2]
      ? props.location.pathname.split("/")[2].replace("_", "/")
      : ""
  }`;

  useEffect(() => {
    const ghRepoInfo = async () => {
      setIsPrivate(false);
      try {
        // Fetches repository information
        const repository = props.location.pathname
          .split("/")[2]
          .replace("_", "/");
        const headers = {
          accept: "application/vnd.github.v3+json",
          Authorization: `Token ${Cookies.get("gh_login_token")}`,
        };
        const ghRepoInfoResponse = await axios({
          method: "get",
          url: `${githubApiDomain}/repos/${repository}`,
          headers: headers,
        });
        setRepoInfo(ghRepoInfoResponse.data);
      } catch (error) {
        console.log(error);
        setIsPrivate(true);
      }
    };

    const fetchRoomMembers = async () => {
      try {
        // User is logged in: Fetch channel members using their tokens
        if (props.authState.isLoggedIn) {
          // If user is viewing a public room
          if (props.location.pathname.split("/")[1] === "channel") {
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
            setRoomMembers(channelMembersResponse.data.members);
          }
          // If user is viewing a private room
          else {
            const groupMembersResponse = await axios({
              method: "get",
              url: `${rcApiDomain}/api/v1/groups.members`,
              headers: {
                "X-Auth-Token": Cookies.get("rc_token"),
                "X-User-Id": Cookies.get("rc_uid"),
              },
              params: {
                roomName: props.location.pathname.split("/")[2],
              },
            });
            setRoomMembers(groupMembersResponse.data.members);
          }
        } else {
          // User not logged in: Fetch channel members through backend
          const anonymousModeChannelMembers = await axios({
            method: "get",
            url: `/api/roomMembers`,
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              roomName: props.location.pathname.split("/")[2],
            },
          });
          setRoomMembers(anonymousModeChannelMembers.data.data);
        }
      } catch (error) {
        // User is logged out and not a member of the private room
        console.log(error);
        setIsNotAccessible(true);
      }
    };
    ghRepoInfo();
    fetchRoomMembers();
    // eslint-disable-next-line
  }, [props.location.pathname]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseMembersDialog = () => {
    setOpenMembersDialog(false);
  };

  return (
    <div className="roominfo-wrapper">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="room info tabs"
        indicatorColor="none"
      >
        <Tab
          className={`roominfo-tab ${activeTab === 0 ? "active-tab" : ""}`}
          label="People"
          {...a11yProps(0)}
        />
        <Tab
          className={`roominfo-tab ${activeTab === 1 ? "active-tab" : ""}`}
          label="Repo Info"
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <div className="roominfo-wrapper">
          {!isNotAccessible ? (
            <>
              <Grid container spacing={2} className="online-users-grid">
                {roomMembers
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
                        <img className="online-status" src="/online.png" alt="online"/>
                        <img
                          className="online-user-avatar"
                          src={`${rcApiDomain}/avatar/${user.username}`}
                          alt={user.username}
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
                <div className="repo-info-owner">
                  <span>by {repoInfo.owner ? repoInfo.owner.login : ""}</span>
                </div>
              </div>

              <div className="repo-info-stats">
                <span>
                  <a
                    href={`https://github.com/search?q=state:open+repo:${repoInfo.full_name}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{repoInfo.open_issues_count}</strong> issues
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
        <DialogTitle>Room Members</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="room-member-grid">
            {roomMembers.map((user) => {
              return (
                <Grid
                  key={user.username}
                  item
                  md={4}
                  className="room-member-grid-item"
                >
                  <img
                    className="room-member-grid-avatar"
                    src={`${rcApiDomain}/avatar/${user.username}`}
                    alt={user.username}
                  />
                  <div className="room-member-grid-name-wrapper">
                    <span className="room-member-grid-name">{user.name}</span>
                    <span className="room-member-grid-username">
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
