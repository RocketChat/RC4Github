import {Link} from "react-router-dom";
import {RiSearchLine} from "react-icons/ri";
import "./index.css";
export default function Home(props) {
    return (
      <div className="home-wrapper">
        <h1>Welcome to RC4GIT</h1>
        <h2>HOME</h2>
        <div>
          <Link to="/home">RC4GIT</Link> is a chat and networking platform that
          helps to manage, grow and connect communities through messaging,
          content and discovery.
        </div>
        <div className="features">
          <ul>
            <li>
              <div className="feature-title">Free without limits</div>
              <div>
                Enjoy free public and private communities with unlimited people,
                message history and integrations.
              </div>
            </li>
            <li>
              <div className="feature-title">Simple to create</div>
              <div className="feature-desc">
                Simply create your community and start talking - no need to set
                up any invitation services.
              </div>
            </li>
            <li>
              <div className="feature-title">Markdown and KaTeX</div>
              <div className="feature-desc">
                Format your messages just like with your other favorite
                developer tools.
              </div>
            </li>
          </ul>
        </div>
        {props.authState.isLoggedIn ? (
          <div className="explore-desc-wrapper">
            Click on the search icon{" "}
            <RiSearchLine className="search-icon-explore-desc" /> in the sidebar
            to explore the list of communities and users already leveraging
            RC4GIT.
          </div>
        ) : (
          <div className="join-button-wrapper">
            <Link to="/login" className="join-button">
              JOIN NOW AND UNLEASH THE POWER OF RC4GIT
            </Link>
          </div>
        )}
      </div>
    );
}
