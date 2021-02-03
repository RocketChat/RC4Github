import "./index.css";

export default function ChatWindow(props) {
  const { pathname } = props.location;
  return (
    <iframe
      src={`http://localhost:3000${pathname}/?layout=embedded`}
      title="myframe"
      className="chatWindow-container"
    ></iframe>
  );
}
