import "./index.css";

export default function AnonymousModeLeftSidebar(props) {
  return (
    <aside className="anonymous-left-sidebar-wrapper">
      <img src="/logo.svg" className="anonymous-sidebar-logo" alt="rc4git" />
      <div className="anonymous-left-sidebar-title-container">
        <h2 className="anonymous-left-sidebar-title">
          Where communities thrive
        </h2>
      </div>
      <div className="anonymous-left-sidebar-content">
        <p>
          FREE <strong>WITHOUT LIMITS</strong>
        </p>
        <p>
          CREATE <strong>YOUR OWN COMMUNITY</strong>
        </p>
        <p>
          EXPLORE <strong>MORE COMMUNITIES</strong>
        </p>
      </div>
    </aside>
  );
}
