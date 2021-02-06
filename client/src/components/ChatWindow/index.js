import { rcApiDomain } from '../../utils/constants';
import "./index.css";

export default function ChatWindow(props) {
  const { pathname } = props.location;
  return (
    <iframe
      src={`${rcApiDomain}${pathname}/?layout=embedded`}
      title="myframe"
      className="chatWindow-container"
    ></iframe>
  );
}
