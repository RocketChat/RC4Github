import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box } from "@material-ui/core";
import Cookies from "js-cookie";
import axios from "axios";
import { githubApiDomain } from "../../utils/constants";

import "./index.css";

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
        setRepoInfo(ghRepoInfoResponse.data);
      } catch (error) {
        console.log(error);
        setIsPrivate(true);
      }
    };
    ghRepoInfo();
  }, [props.location.pathname]);

  const [activeTab, setActiveTab] = useState(0);
  const repoURL = `https://github.com/${props.location.pathname
    .split("/")[2]
    .replace("_", "/")}`;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
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
          className={`channel-info-tab ${activeTab == 0 ? "active-tab" : ""}`}
          label="People"
          {...a11yProps(0)}
        />
        <Tab
          className={`channel-info-tab ${activeTab == 1 ? "active-tab" : ""}`}
          label="Repo Info"
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        {/* TODO: Users Online */}
        Users
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
                  <a href={`${repoURL}/issues`}>
                    <strong>{repoInfo.open_issues_count}</strong> issues
                  </a>
                </span>
                <span>
                  <a href={`${repoURL}/watchers`}>
                    <strong>{repoInfo.watchers_count}</strong> watchers
                  </a>
                </span>
                <span>
                  <a href={`${repoURL}/stargazers`}>
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
    </div>
  );
}
