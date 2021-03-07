import { Switch, Route, Link } from "react-router-dom";
import "./index.css";

export default function AnonymousModeLeftSidebar(props) {
  const {rooms, users, onlineUsers, totalMessages} = props.stats;
  return (
    <aside className="anonymous-left-sidebar-wrapper">
      <Link to="/">
        <img src="/logo.svg" className="anonymous-sidebar-logo" alt="rc4git" />
      </Link>
      <div className="anonymous-left-sidebar-title-container">
        <h2 className="anonymous-left-sidebar-title">
          Where communities shape the future
        </h2>
      </div>
      <div className="anonymous-left-sidebar-content">
        <Switch>
          <Route path={["/channel"]}>
            <p className="sidebar-stat">
              <img
                src="https://img.icons8.com/plasticine/35/000000/organization.png"
                alt="rooms"
              />
              <strong className="sidebar-stat-number">{rooms}</strong>&nbsp;
              <span className="sidebar-stat-label">Rooms</span>
            </p>
            <p className="sidebar-stat">
              <img
                src="https://img.icons8.com/color/35/000000/circled-user-male-skin-type-7--v2.png"
                alt="users"
              />
              <strong className="sidebar-stat-number">{users}</strong>&nbsp;
              <span className="sidebar-stat-label">Users</span>
            </p>
            <p className="sidebar-stat">
              <img
                src="https://img.icons8.com/color/35/000000/filled-chat.png"
                alt="messages exchanged"
              />
              <strong className="sidebar-stat-number">{totalMessages}</strong>
              &nbsp;
              <span className="sidebar-stat-label">Messages Exchanged</span>
            </p>
            <p className="sidebar-stat">
              <img
                src="https://img.icons8.com/color/35/000000/online--v1.png"
                alt="online-users"
              />
              <strong className="sidebar-stat-number">{onlineUsers}</strong>
              &nbsp;
              <span className="sidebar-stat-label">Total Online Users</span>
            </p>
          </Route>
          <Route path={["/"]}>
            <p>
              FREE <strong>WITHOUT LIMITS</strong>
            </p>
            <p>
              CREATE <strong>YOUR OWN COMMUNITY</strong>
            </p>
            <p>
              EXPLORE <strong>MORE COMMUNITIES</strong>
            </p>
            <p>
              FORMAT <strong>USING MARKDOWN AND KATEX</strong>
            </p>
            <p>
              GET <strong>GITHUB ACTIVITY UPDATES IN REALTIME</strong>
            </p>
          </Route>
        </Switch>
      </div>
    </aside>
  );
}
