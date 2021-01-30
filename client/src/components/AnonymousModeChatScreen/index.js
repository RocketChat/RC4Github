import LeftSidebar from "./LeftSidebar";
import ChatWindow from "./../ChatWindow/";

import "./index.css";

export default function AnonymousModeChatScreen(props) {
  return (
    <>
      <LeftSidebar></LeftSidebar>
      <ChatWindow {...props}></ChatWindow>
    </>
  );
}
