import { CgHashtag } from "react-icons/cg";
import {BsFillLockFill} from "react-icons/bs";
import { NavLink } from "react-router-dom";

import "./index.css";
import { rcApiDomain } from "../../utils/constants";
export default function RoomItem({room}) {
    return (
      <NavLink
        to={`/${room["t"] === 'c' ? "channel" : room["t"] === 'p' ? "group" : "direct"}/${room.name}`}
        className="room-wrapper"
        activeClassName="active-room"
      >
        <img
          alt={"room-icon"}
          src={`${rcApiDomain}/avatar/room/${room.rid}`}
          className="room-item-icon"
        ></img>
        {room["t"] === "c" ? (
          <CgHashtag className="room-item-type-icon"></CgHashtag>
        ) : room["t"] === "p" ? (
          <BsFillLockFill className="room-item-type-icon"></BsFillLockFill>
        ) : null}
        <span className="room-name">
          {room.name.split(/_(.+)/)[1]
            ? room.name.split(/_(.+)/)[1]
            : room.name.split(/_(.+)/)[0]}
        </span>
      </NavLink>
    );
}
