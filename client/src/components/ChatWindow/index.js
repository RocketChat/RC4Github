import { useEffect } from "react";
import { rcApiDomain } from "../../utils/constants";
import "./index.css";

export default function ChatWindow(props) {
  const { pathname } = props.location;
  useEffect(() => {
    document.getElementsByTagName(
      "iframe"
    )[0].src = `${rcApiDomain}${pathname}/?layout=embedded`;
  }, []);
  useEffect(() => {
    const iframe = document.getElementsByTagName("iframe")[0];
    iframe.contentWindow.postMessage(
      { externalCommand: "go", path: `${pathname}/?layout=embedded` },
      `${rcApiDomain}`
    );
  }, [pathname]);
  return (
    <div className="chatWindow-container">
      <div className="loading-chatWindow"></div>
      <iframe
        src={`${rcApiDomain}/home/?layout=embedded`}
        title="myframe"
        className="chatWindow"
      ></iframe>
    </div>
  );
}
