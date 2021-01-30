import LeftSidebar from "./LeftSidebar";
import ChatWindow from "./../ChatWindow/";

import './index.css';

export default function SignedChatScreen(props) {
  return (
    <>
      <LeftSidebar></LeftSidebar>
      <ChatWindow {...props}></ChatWindow>
    </>
  );
}
