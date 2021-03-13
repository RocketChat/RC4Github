import { Button } from "@material-ui/core";
import Countup from "./../common/Countup";

import "./index.css";

export default function Home(props) {
  const { users, rooms, onlineUsers, totalMessages } = props.stats;

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
            Real-time Collaboration
            <br />
            <a
              href="http://github.com/RocketChat/RC4Community"
              rel="noreferrer"
              target="_blank"
              className="powered-by-title"
            >
              <strong>Powered by RCforCommunities</strong>
            </a>
          </h1>

          <p className="unsigned-home-text">
            <strong>Monitor</strong> your <strong>workflows</strong>,
            <strong>collaborate</strong> and <strong>access data</strong> any
            time you need it, all in one{" "}
            <strong>productivity-amplifying</strong> full-lifecycle platform
          </p>
        </header>
        <div className="rocket-logo"></div>
        <main>
          <div className="main-stats-container">
            <div className="stat-container">
              <img
                src="https://img.icons8.com/plasticine/80/000000/organization.png"
                alt="rooms"
              />
              <Countup end={rooms} className="stat-number" />
              <div className="stat-label">Rooms</div>
            </div>
            <div className="stat-container">
              <img
                src="https://img.icons8.com/color/80/000000/circled-user-male-skin-type-7--v2.png"
                alt="users"
              />
              <Countup end={users} className="stat-number" />
              <div className="stat-label">Users</div>
            </div>
            <div className="stat-container">
              <img
                src="https://img.icons8.com/color/80/000000/filled-chat.png"
                alt="messages"
              />
              <Countup end={totalMessages} className="stat-number" />
              <div className="stat-label">Messages Exchanged</div>
            </div>
            <div className="stat-container">
              <img
                src="https://img.icons8.com/color/80/000000/online--v1.png"
                alt="online-users"
              />
              <Countup end={onlineUsers} className="stat-number" />
              <div className="stat-label">Online Users</div>
            </div>
          </div>
          <div className="button-container">
            <Button variant="contained" color="primary" href="/login">
              JOIN NOW TO EXPLORE MORE
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
        <p>
          We're ready to go.
        </p>
      </header>
      <div class="signed-home-main">
        <div>
          <div class="signed-home-shortcut-container">
            <h5>Start something new</h5>
            <div
              className="signed-home-shortcut"
              onClick={() => {
                document.getElementById("create-room").click();
              }}
            >
              <img
                src="https://img.icons8.com/plasticine/35/000000/organization.png"
                className="shortcut-icon-medium"
              />
              Create a room
            </div>
          </div>
          <div className="signed-home-shortcut-container">
            <h5>Explore more</h5>
            <div
              className="signed-home-shortcut"
              onClick={() => {
                document.getElementById("search").click();
              }}
            >
              <img
                src="/search-icon.png"
                className="shortcut-icon-small"
              />
              Discover existing rooms
            </div>
          </div>
        </div>
        <img src="/community.jpg" className="community-home-img"></img>
      </div>
    </div>
  );
}
