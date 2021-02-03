import { useEffect, useState } from "react";
import { RiHome4Line, RiSearchLine } from "react-icons/ri";
import { IoCreateOutline } from "react-icons/io5";
import { HiSortDescending } from "react-icons/hi";
import { CgCommunity, CgHashtag } from "react-icons/cg";
import { Link } from "react-router-dom";
import CommunityListItem from "../CommunityListItem";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Cookies from "js-cookie";
import CreateCommunity from "../CreateCommunity";
import CreateChannel from "../CreateChannel";
import axios from "axios";
import { rcApiDomain, githubApiDomain } from "./../../utils/constants";

import "./index.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignedLeftSidebar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCommunityDialog, setopenCommunityDialog] = useState(false);
  const [openChannelDialog, setopenChannelDialog] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [communities, setCommunities] = useState({});
  const [directMessages, setDirectMessages] = useState([]);

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
    setopenCommunityDialog(false);
  };

  const handleCloseChannelDialog = () => {
    setopenChannelDialog(false);
  };

  const handleCreateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateClose = () => {
    setAnchorEl(null);
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

  return (
    <div className="signed-left-sidebar-wrapper">
      <div className="signed-left-sidebar-header">
        <img
          className="left-sidebar-user-avatar"
          alt={"username"}
          src={props.user.avatarUrl}
        ></img>
        <div className="left-sidebar-control">
          <Link to="/">
            <div className="left-sidebar-control-icons">
              <RiHome4Line />
            </div>
          </Link>
          <div className="left-sidebar-control-icons">
            <RiSearchLine />
          </div>
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
              setopenCommunityDialog(true);
              handleCreateClose();
            }}
          >
            <CgCommunity color="#000" className="create-menu-icons" />
            Create Community
          </MenuItem>
          <MenuItem
            onClick={() => {
              fetchOrganizations();
              setopenChannelDialog(true);
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
        />
      )}
      {openChannelDialog && (
        <CreateChannel
          handleCloseChannelDialog={handleCloseChannelDialog}
          organizations={organizations}
          setSnackbar={setSnackbar}
          addRoom={addRoom}
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
