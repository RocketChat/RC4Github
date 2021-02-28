import { rcApiDomain } from "../../utils/constants";
import "./index.css";

export default function ChatWindow(props) {
  const { pathname } = props.location;
  return (
    <div className="chatWindow-container" >
      <div className="loading-chatWindow"></div>
      <iframe
        src={`${rcApiDomain}${pathname}?layout=embedded`}
        title="myframe"
        className="chatWindow"
      ></iframe>
    </div>
  );
}
