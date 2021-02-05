import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {rcApiDomain} from "./../../utils/constants";
import Cookies from "js-cookie";
import RoomItem from "./../RoomItem";

import "./index.css";

export default function SidebarSearch(props) {
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    let labelRef = useRef(null);
    const handleInputFocus = () => {
        labelRef.current.style.color = "#1d74f5";
        labelRef.current.style.borderColor = "#1d74f5";
    };
    const handleInputBlur = () => {
      labelRef.current.style.color = "#cbced1";
      labelRef.current.style.borderColor = "#cbced1";
    };

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
        fetchSearchResults();
    };

    const fetchSearchResults = () => {
        const url = `${rcApiDomain}/api/v1/spotlight?query=${searchInput}`;
        fetch(url, {
            headers: {
                "X-Auth-Token": Cookies.get('rc_token'),
                "X-User-Id": Cookies.get('rc_uid'),
                "Accept": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
            setSearchResults([...data["users"], ...data["rooms"]]);
        }).catch(err => {
          console.log("Error searching rooms --->", err);
        })
    }

    return (
      <div className="sidebar-search-wrapper">
        <div className="sidebar-search-header">
          <label className="sidebar-search-input-box" ref={labelRef}>
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={searchInput}
              onChange={handleSearchInput}
            />
            <AiOutlineClose
              className="hover-pointer"
              onClick={props.handleSearchClose}
            ></AiOutlineClose>
          </label>
        </div>
        <hr className="left-sidebar-divider"></hr>
        <div className="sidebar-search-body">
          {searchResults.map((room) => {
            return <RoomItem room={room} key={room._id}></RoomItem>;
          })}
        </div>
      </div>
    );
}
