import { CgHashtag } from "react-icons/cg";
import {FiLock, FiUser} from "react-icons/fi";
import { NavLink } from "react-router-dom";

import "./index.css";
import { rcApiDomain } from "../../utils/constants";
export default function RoomItem({ room }) {
  return (
    <NavLink
      to={`/${
        room["t"] === "c" ? "channel" : room["t"] === "p" ? "group" : "direct"
      }/${room.username || room.name}`}
      className="room-wrapper"
      activeClassName="active-room"
    >
      <img
        alt={"room-icon"}
        src={`${rcApiDomain}/avatar/${
          room["username"] || `room/${room.rid || room._id}`
        }`}
        className="room-item-icon"
      ></img>
      {room["t"] === "c" ? (
        <CgHashtag className="room-item-type-icon"></CgHashtag>
      ) : room["t"] === "p" ? (
        <FiLock className="room-item-type-icon"></FiLock>
      ) : (
        <FiUser className="room-item-type-icon"></FiUser>
      )}
      <span className="room-name">
        {room.name.split(/_(.+)/)[1] && room["t"] !== "d"
          ? room.name.split(/_(.+)/)[1]
          : room.name.substring(0, room.name.lastIndexOf("_rc4git")) === ""
          ? room.name
          : room.name.substring(0, room.name.lastIndexOf("_rc4git"))}
        {room.username
          ? ` (${
              room.username.substring(
                0,
                room.username.lastIndexOf("_rc4git")
              ) || room.username
            })`
          : null}
      </span>
    </NavLink>
  );
}
