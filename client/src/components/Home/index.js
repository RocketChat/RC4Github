import LeftSidebar from './../SignedChatScreen/LeftSidebar';
import "./index.css";
export default function Home(props) {
    return (
      <>
        <LeftSidebar user={props.user}></LeftSidebar>
        <div className="home-wrapper">
          <h1 className="home-title">Welcome to RC4GIT</h1>
        </div>
      </>
    );
}
