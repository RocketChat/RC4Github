import { useEffect } from "react";
import { rcApiDomain } from "../../utils/constants";
import "./index.css";

export default function ChatWindow(props) {
  const { pathname } = props.location;
  useEffect(() => {
    const iframe = window.document.getElementsByTagName("iframe")[0];
    iframe.src = `${rcApiDomain}${pathname}/?layout=embedded`;
  }, []);
  useEffect(() => {
    const iframe = window.document.getElementsByTagName("iframe")[0];
    iframe.contentWindow.postMessage(
      { externalCommand: "go", path: `${pathname}/?layout=embedded` },
      `${rcApiDomain}`
    );
  }, [pathname]);
  return (
    <iframe
      src={`${rcApiDomain}/home/?layout=embedded`}
      title="myframe"
      className="chatWindow-container"
    ></iframe>
  );
}
