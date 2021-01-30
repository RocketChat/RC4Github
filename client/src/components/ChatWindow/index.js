import React from "react";

import "./index.css";

export default class ChatWindow extends React.Component {
  render() {
    const { pathname } = this.props.location;
    return (
      <iframe
        src={`http://localhost:3000${pathname}/?layout=embedded`}
        title="myframe"
        className="chatWindow-container"
      ></iframe>
    );
  }
}
