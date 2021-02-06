import React, { useEffect, useState } from "react";
import { RiHome4Line, RiSearchLine } from "react-icons/ri";
import { IoCreateOutline } from "react-icons/io5";
import { HiSortDescending } from "react-icons/hi";
import { CgCommunity, CgHashtag } from "react-icons/cg";
import { MdContentCopy } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CommunityListItem from "../CommunityListItem/";
import {
  Menu,
  MenuItem,
  Snackbar,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Button,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Cookies from "js-cookie";
import CreateCommunity from "../CreateCommunity";
import CreateChannel from "../CreateChannel";
import axios from "axios";
import { rcApiDomain, githubApiDomain, rc4gitApiDomain } from "./../../utils/constants";
import SyntaxHighlighter from "react-syntax-highlighter";
import CopyToClipboard from "react-copy-to-clipboard";
import SidebarSearch from "../SidebarSearch";

import "./index.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SignedLeftSidebar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [openCommunityDialog, setOpenCommunityDialog] = useState(false);
  const [openChannelDialog, setOpenChannelDialog] = useState(false);
  const [openEmbedDialog, setOpenEmbedDialog] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [communities, setCommunities] = useState({});
  const [directMessages, setDirectMessages] = useState([]);
  const [channelURL, setChannelURL] = useState("");
  const [createdType, setCreatedType] = useState("channel");
  const [embedCodeString, setEmbedCodeString] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchRooms = () => {
    const url = `${rcApiDomain}/api/v1/users.info?userId=${Cookies.get(
      "rc_uid"
    )}&fields={"userRooms": 1}`;
    fetch(url, {
      headers: {
        "X-Auth-Token": Cookies.get("rc_token"),
        "X-User-Id": Cookies.get("rc_uid"),
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        let rooms = data.user.rooms;
        console.log(rooms);
        let communities = {};
        let directMessages = [];
        for (let room of rooms) {
          if (room["t"] === "c" || room["t"] === "p") {
            let community_name = room.name.split(/_(.+)/)[0];
            if (!communities[community_name]) communities[community_name] = [];
            communities[community_name].push(room);
          } else {
            directMessages.push(room);
          }
        }
        setRooms(rooms);
        setCommunities(communities);
        setDirectMessages(directMessages);
      })
      .catch((err) => {
        console.log("Error Fetching Rooms from server --->", err);
      });
  };

  const addRoom = (room) => {
    setRooms([...rooms, room]);
    if (room["t"] === "c" || room["t"] === "p") {
      let newCommnunities = { ...communities };
      let community_name = room.name.split(/_(.+)/)[0];
      if (!newCommnunities[community_name])
        newCommnunities[community_name] = [];
      newCommnunities[community_name].push(room);
      setCommunities(newCommnunities);
    } else {
      setDirectMessages([...directMessages, room]);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCloseCommunityDialog = () => {
    setOpenCommunityDialog(false);
  };

  const handleCloseChannelDialog = () => {
    setOpenChannelDialog(false);
  };

  const handleCreateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const setSnackbar = (snackbarOpen, snackbarSeverity, snackbarText) => {
    setSnackbarOpen(snackbarOpen);
    setSnackbarSeverity(snackbarSeverity);
    setSnackbarText(snackbarText);
  };

  const setEmbedDialog = (openEmbedDialog, channelURL, createdType) => {
    setOpenEmbedDialog(openEmbedDialog);
    setChannelURL(channelURL);
    setCreatedType(createdType);
    setEmbedCodeString(`<a href="${channelURL}">
  <img src="http://localhost:3000/images/join-chat.svg" />
</a>`);
  };

  const fetchOrganizations = async () => {
    try {
      const authToken = Cookies.get("gh_login_token");
      const headers = {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${authToken}`,
      };

      const ghOrgResponse = await axios({
        method: "get",
        url: `${githubApiDomain}/user/orgs`,
        headers: headers,
      });

      const organizations = ghOrgResponse.data.map((organization) => {
        return { group: "Organization", value: organization.login };
      });
      setOrganizations(organizations);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const logout = () => {
    const loadingIcon = document.getElementById("logout-loading-icon");
    const logoutButton = document.getElementById("logout-menu-item");
    loadingIcon.classList.remove("hide-logout-loading");
    logoutButton.classList.add("disable-click");
    fetch(`${rc4gitApiDomain}/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        Cookies.remove("rc4git_token");
        Cookies.remove("rc_uid");
        Cookies.remove("rc_token");
        Cookies.remove("gh_login_token");
        Cookies.remove("gh_private_repo_token");
        window.location = "/login";
      })
      .catch((err) => {
        console.log("Error logging out --->", err);
        loadingIcon.classList.add("hide-logout-loading");
        logoutButton.classList.remove("disable-click");
        return;
      });
  };

  return (
    <div className="signed-left-sidebar-wrapper">
      <div className="signed-left-sidebar-header">
        <img
          className="left-sidebar-user-avatar"
          alt={"username"}
          src={props.user.avatarUrl}
          onClick={handleProfileClick}
        ></img>
        <Menu
          id="profile-menu"
          anchorEl={profileAnchorEl}
          keepMounted
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div className="profile-wrapper">
            <div className="profile-left-container">
              <img
                className="profile-menu-img"
                alt={"username"}
                src={props.user.avatarUrl}
              ></img>
            </div>
            <div className="profile-right-container">
              <div className="profile-name">{props.user.name}</div>
              <div className="profile-username">{props.user.username}</div>
            </div>
          </div>
          <MenuItem id="logout-menu-item" onClick={logout}>
            <FiLogOut color="#000" className="create-menu-icons" />
            Logout
            <VscLoading
              id="logout-loading-icon"
              className="hide-logout-loading loading-icon"
            />
          </MenuItem>
        </Menu>
        <div className="left-sidebar-control">
          <Link to="/">
            <div className="left-sidebar-control-icons">
              <RiHome4Line />
            </div>
          </Link>
          <div
            className="left-sidebar-control-icons"
            onClick={toggleShowSearch}
          >
            <RiSearchLine />
          </div>
          {showSearch ? (
            <SidebarSearch handleSearchClose={toggleShowSearch}></SidebarSearch>
          ) : null}
          <div className="left-sidebar-control-icons">
            <HiSortDescending />
          </div>
          <div
            className="left-sidebar-control-icons"
            onClick={handleCreateClick}
          >
            <IoCreateOutline />
          </div>
        </div>
        <Menu
          id="create-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCreateClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              fetchOrganizations();
              setOpenCommunityDialog(true);
              handleCreateClose();
            }}
          >
            <CgCommunity color="#000" className="create-menu-icons" />
            Create Community
          </MenuItem>
          <MenuItem
            onClick={() => {
              fetchOrganizations();
              setOpenChannelDialog(true);
              handleCreateClose();
            }}
          >
            <CgHashtag color="#000" className="create-menu-icons" />
            Create Channel
          </MenuItem>
        </Menu>
      </div>
      {openCommunityDialog && (
        <CreateCommunity
          handleCloseCommunityDialog={handleCloseCommunityDialog}
          organizations={organizations}
          setSnackbar={setSnackbar}
          addRoom={addRoom}
          setEmbedDialog={setEmbedDialog}
        />
      )}
      {openChannelDialog && (
        <CreateChannel
          handleCloseChannelDialog={handleCloseChannelDialog}
          organizations={organizations}
          setSnackbar={setSnackbar}
          addRoom={addRoom}
          setEmbedDialog={setEmbedDialog}
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
      {openEmbedDialog && (
        <Dialog
          open={true}
          keepMounted
          onClose={() => setOpenEmbedDialog(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          TransitionComponent={Transition}
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogTitle>Add a Rocket Chat Badge </DialogTitle>
          <DialogContent>
            <a href={channelURL}>
              <img src="http://localhost:3000/images/join-chat.svg" />
            </a>
            <br />
            <br />
            <p>
              Embed a Rocket Chat badge and launch your {createdType} right from
              your repositories 🚀{" "}
            </p>
            <div className="code-copy-icon-div">
              <CopyToClipboard text={embedCodeString}>
                <MdContentCopy
                  title="Copy to Clipboard"
                  className="code-copy-icon"
                  onClick={() => {
                    setSnackbar(true, "success", "Copied to Clipboard!");
                  }}
                />
              </CopyToClipboard>
            </div>
            <SyntaxHighlighter language="html" id="syntax-highlight">
              {embedCodeString}
            </SyntaxHighlighter>
            <br />
            <Button
              onClick={() => setOpenEmbedDialog(false)}
              style={{ marginBottom: "10px" }}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          </DialogContent>
        </Dialog>
      )}
      <hr className="left-sidebar-divider"></hr>
      <div className="signed-left-sidebar-body">
        {Object.keys(communities).map((community_name) => {
          return (
            <CommunityListItem
              community={communities[community_name]}
              key={community_name}
              community_name={community_name}
            ></CommunityListItem>
          );
        })}
        {directMessages.length > 0 ? (
          <CommunityListItem
            community={directMessages}
            key={"Direct Messages"}
            community_name={"Direct Messages"}
          ></CommunityListItem>
        ) : null}
      </div>
      <div className="signed-left-sidebar-footer">
        <img
          src="/logo.svg"
          className="left-sidebar-footer-logo"
          alt="rc4git"
        />
      </div>
    </div>
  );
}
