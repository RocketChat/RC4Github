import React from "react";
import { Button } from "@material-ui/core";
import Countup from "./../common/Countup";
import { Trans, useTranslation } from "react-i18next";

import "./index.css";

export default function Home(props) {
  const { users, onlineUsers, totalMessages } = props.stats;

  const { t, i18n } = useTranslation();

  const getGreetings = () => {
    let d = new Date();
    let time = d.getHours();

    if (time < 12) {
      return "Good morning";
    }
    if (time <= 17) {
      return "Good afternoon";
    }
    return "Good evening";
  };

  if (!props.authState.isLoggedIn) {
    return (
      <div className="home-wrapper">
        <header className="unsigned-home-header">
          <h1 className="unsigned-home-heading">
            {t("unsigned-home.heading")}
            <br />
            <a
              href="http://github.com/RocketChat/RC4Community"
              rel="noreferrer"
              target="_blank"
              className="powered-by-title"
            >
              <strong>{t("unsigned-home.subheading")}</strong>
            </a>
          </h1>

          <p className="unsigned-home-text">
            <Trans i18nKey="unsigned-home.description">
              <strong>Monitor</strong> your <strong>workflows</strong>,
              <strong>collaborate</strong> and <strong>access data</strong> any
              time you need it, all in one{" "}
              <strong>productivity-amplifying</strong> full-lifecycle platform
            </Trans>
          </p>
        </header>
        <main>
          <div className="main-stats-container">
            <div className="stat-container">
              <img
                src="https://img.icons8.com/color/80/000000/circled-user-male-skin-type-7--v2.png"
                alt="users"
                className="stat-icon"
              />
              <Countup end={users} className="stat-number" />
              <div className="stat-label">
                {t("unsigned-home.users-stats-label")}
              </div>
            </div>
            <div className="stat-container">
              <img
                src="https://img.icons8.com/color/80/000000/filled-chat.png"
                alt="messages"
                className="stat-icon"
              />
              <Countup end={totalMessages} className="stat-number" />
              <div className="stat-label">
                {t("unsigned-home.messages-exchanged-stats-label")}
              </div>
            </div>
            <div className="stat-container">
              <img
                src="https://img.icons8.com/color/80/000000/online--v1.png"
                alt="online-users"
                className="stat-icon"
              />
              <Countup end={onlineUsers} className="stat-number" />
              <div className="stat-label">
                {t("unsigned-home.online-users-stats-label")}
              </div>
            </div>
          </div>
          <div className="button-container">
            <Button variant="contained" color="primary" href="/login">
              {t("unsigned-home.join-button")}
            </Button>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="home-wrapper">
      <header class="signed-home-header">
        <h2>
          {getGreetings()}, {props.authState.user.name}
        </h2>
        <p>{t("signed-home.heading")}</p>
      </header>
      <div class="signed-home-main">
        <div>
          <div class="signed-home-shortcut-container">
            <h5>{t("signed-home.start-heading")}</h5>
            <div
              className="signed-home-shortcut"
              onClick={() => {
                document.getElementById("create-room").click();
              }}
            >
              <img
                src="https://img.icons8.com/plasticine/35/000000/organization.png"
                className="shortcut-icon-medium"
                alt="room"
              />
              {t("signed-home.create-room")}
            </div>
          </div>
          <div className="signed-home-shortcut-container">
            <h5>{t("signed-home.explore-heading")}</h5>
            <div
              className="signed-home-shortcut"
              onClick={() => {
                document.getElementById("search").click();
              }}
            >
              <img
                src="/search-icon.png"
                className="shortcut-icon-small"
                alt="search"
              />
              {t("signed-home.discover-rooms")}
            </div>
          </div>
        </div>
        <img
          src="/community.jpg"
          className="community-home-img"
          alt="community"
        ></img>
      </div>
    </div>
  );
}
