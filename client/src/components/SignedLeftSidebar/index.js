import React, { useEffect, useState } from "react";
import { RiHome4Line, RiSearchLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { HiSortDescending } from "react-icons/hi";
import { CgCommunity, CgHashtag } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { VscLoading } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CommunityListItem from "../CommunityListItem/";
import { Menu, MenuItem, Snackbar, Checkbox, Radio } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Cookies from "js-cookie";
import CreateCommunity from "../CreateCommunity";
import CreateChannel from "../CreateChannel";
import axios from "axios";
import { rcApiDomain, githubApiDomain } from "./../../utils/constants";
import SidebarSearch from "../SidebarSearch";

import "./index.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignedLeftSidebar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [startCreateCommunity, setStartCreateCommunity] = useState(false);
  const [startCreateChannel, setStartCreateChannel] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [communities, setCommunities] = useState({});
  const [directMessages, setDirectMessages] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [groupByCommunity, setGroupByCommunity] = useState(true);

  const sortRoomsAlphabetically = () => {
    let chatRooms = rooms;
    chatRooms.sort((a, b) => {
      let roomAname = a.name.split(/_(.+)/)[1] || a.name;
      let roomBname = b.name.split(/_(.+)/)[1] || b.name;
      roomAname = roomAname.toUpperCase();
      roomBname = roomBname.toUpperCase();
      if (roomAname < roomBname) {
        return -1;
      }
      if (roomAname > roomBname) {
        return 1;
      }
      return 0;
    });
    setChatRooms(chatRooms);
  };

  const setChatRooms = (rooms) => {
    let communities = {};
    let directMessages = [];
    rooms.forEach((room) => {
      if (room["t"] === "c" || room["t"] === "p") {
        let community_name = room.name.split(/_(.+)/)[0];
        if (!communities[community_name]) communities[community_name] = [];
        communities[community_name].push(room);
      } else {
        directMessages.push(room);
      }
    });
    setRooms(rooms);
    setCommunities(communities);
    setDirectMessages(directMessages);
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
    const url = `${rcApiDomain}/api/v1/subscriptions.get`;
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
        setChatRooms(data.update);
      })
      .catch((err) => {
        console.log("Error Fetching Rooms from server --->", err);
      });
  }, []);

  const handleEndCreateCommunity = () => {
    setStartCreateCommunity(false);
  };

  const handleEndCreateChannel = () => {
    setStartCreateChannel(false);
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
    const iframe = document.getElementsByTagName("iframe")[0];
    if (iframe) {
      iframe.contentWindow.postMessage(
        { externalCommand: "logout" },
        `${rcApiDomain}`
      );
      document.getElementsByClassName("loading-chatWindow")[0].classList.remove("hide-chatWindow");
    }
    const loadingIcon = document.getElementById("logout-loading-icon");
    const logoutButton = document.getElementById("logout-menu-item");
    loadingIcon.classList.remove("hide-logout-loading");
    logoutButton.classList.add("disable-click");
    fetch(`/api/logout`, {
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
        document
          .getElementsByClassName("loading-chatWindow")[0]
          .classList.add("hide-chatWindow");
        return;
      });
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const openSortMenu = (event) => {
    setSortAnchorEl(event.currentTarget);
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
          getContentAnchorEl={null}
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
          <div className="left-sidebar-control-icons" onClick={openSortMenu}>
            <HiSortDescending />
          </div>
          <Menu
            id="sort-menu"
            anchorEl={sortAnchorEl}
            keepMounted
            open={Boolean(sortAnchorEl)}
            onClose={handleSortMenuClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            getContentAnchorEl={null}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="menu-section-wrapper">
              <div className="menu-section-title">SORT</div>
              <div className="menu-option pointer-cursor">
                <label for="alpha-sort" className="pointer-cursor">
                  Alphabetical
                </label>
                <Radio
                  color="primary"
                  id="alpha-sort"
                  onChange={sortRoomsAlphabetically}
                />
              </div>
            </div>
            <hr className="menu-section-divider"></hr>
            <div className="menu-section-wrapper">
              <div className="menu-section-title">Group by</div>
              <div className="menu-option pointer-cursor">
                <label for="group-communities" className="pointer-cursor">
                  Communities
                </label>
                <Checkbox
                  defaultChecked
                  color="primary"
                  id="group-communities"
                  onChange={() => {
                    setGroupByCommunity(!groupByCommunity);
                  }}
                />
              </div>
            </div>
          </Menu>
          <div
            className="left-sidebar-control-icons"
            onClick={handleCreateClick}
          >
            <IoMdAdd />
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
          getContentAnchorEl={null}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              fetchOrganizations();
              setStartCreateCommunity(true);
              handleCreateClose();
            }}
          >
            <CgCommunity color="#000" className="create-menu-icons" />
            Create Community
          </MenuItem>
          <MenuItem
            onClick={() => {
              fetchOrganizations();
              setStartCreateChannel(true);
              handleCreateClose();
            }}
          >
            <CgHashtag color="#000" className="create-menu-icons" />
            Create Channel
          </MenuItem>
        </Menu>
      </div>
      {startCreateCommunity && (
        <CreateCommunity
          handleEndCreateCommunity={handleEndCreateCommunity}
          organizations={organizations}
          setSnackbar={setSnackbar}
          addRoom={addRoom}
        />
      )}
      {startCreateChannel && (
        <CreateChannel
          handleEndCreateChannel={handleEndCreateChannel}
          organizations={organizations}
          setSnackbar={setSnackbar}
          addRoom={addRoom}
          rooms={rooms}
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
        {!groupByCommunity && (
          <CommunityListItem
            community={rooms}
            key={"Conversations"}
            community_name={"Conversations"}
          ></CommunityListItem>
        )}
        {groupByCommunity &&
          Object.keys(communities).map((community_name) => {
            return (
              <CommunityListItem
                community={communities[community_name]}
                key={community_name}
                community_name={community_name}
              ></CommunityListItem>
            );
          })}
        {groupByCommunity && directMessages.length > 0 ? (
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
