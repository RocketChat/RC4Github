import {Button} from '@material-ui/core';
import Countup from "./../common/Countup";

import "./index.css";

export default function Home(props) {
    const { users, channels, onlineUsers, totalMessages } = props.stats;
    if(!props.authState.isLoggedIn){
      return (
        <div className="home-wrapper">
          <header>
            <h1>
              Real-time Collaboration
              <br />
              <strong>Powered by RC4GIT Community</strong>
            </h1>

            <p>
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
                  alt="channels"
                />
                <Countup end={channels} className="stat-number" />
                <div className="stat-label">Channels</div>
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
    return <div></div>
}
