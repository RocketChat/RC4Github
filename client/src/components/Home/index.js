import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import Carousel, {
  slidesToShowPlugin,
  slidesToScrollPlugin,
  autoplayPlugin,
} from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import { BsSearch } from "react-icons/bs";
import { FiThumbsUp } from "react-icons/fi";
import { FaRegComment, FaLaptopCode, FaRegSun } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";
import Countup from "./../common/Countup";
import { rcApiDomain } from "../../utils/constants";
import VisibilitySensor from "react-visibility-sensor";
import RCSwitch from "../RCSwitch";

import "./index.css";

export default function Home(props) {
  const { users, onlineUsers, totalMessages } = props.stats;
  const [searchCategory, setSearchCategory] = useState("");
  const [carouselValue, setCarouselValue] = useState(0);
  const [startCounter, setStartCounter] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const carouselItems = [
    {
      name: "Data protection solutions",
      description: "5 security features that every company should keep in mind",
      imageUrl:
        "https://528977-1685022-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2021/03/Cover-Image-Blog-11.jpg.webp",
      url:
        "https://rocket.chat/blog/learn/data-protection-solutions-security-features/",
    },
    {
      name: "Rocket.Chat raises $19m",
      description:
        "In Series A funding confirming privacy-first communication as a major trend in 2021",
      imageUrl:
        "https://528977-1685022-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2021/02/new_header.jpg.webp",
      url:
        "https://rocket.chat/blog/company/rocket-chat-raises-19-million-in-series-a-funding-confirming-privacy-first-communication-as-a-major-trend-in-2021/",
    },
    {
      name: "4 Different Slack Alternatives",
      description:
        "We’ve Tried 4 Different Slack Alternatives & Here’s Our Conclusion",
      imageUrl:
        "https://528977-1685022-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2020/12/Frame-9.png.webp",
      url: "https://rocket.chat/blog/learn/slack-alternative/",
    },
    {
      name: "Is WhatsApp safe for companies?",
      description: "A quick guide for secure messaging",
      imageUrl:
        "https://528977-1685022-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2021/01/whatsapp-safe-secure-messaging-blog.jpg",
      url: "https://rocket.chat/blog/learn/whatsapp-guide-secure-messaging/",
    },
    {
      name: "Security Bundle",
      description:
        "Get to Know Rocket.Chat’s Newest Weapon For Secure Messaging",
      imageUrl:
        "https://528977-1685022-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2021/02/Security-Bundle-Ilustra.jpg.webp",
      url:
        "https://rocket.chat/blog/product/security-bundle-for-secure-messaging/",
    },
  ];

  const activityItems = [
    {
      title:
        "I am setting up live chat and want to send an attachment ...how do I do that?",
      author: "LigayaFernandez",
      role: "LiveChat User",
      community: "Question Forum",
      time: "17 min ago",
      upvotes: 0,
      comments: 1,
    },
    {
      title: "Stranger Introduction",
      author: "Izzie ",
      role: "GSoC Student",
      community: "GSoC 2021",
      time: "1 hour ago",
      upvotes: 5,
      comments: 10,
    },
    {
      title: "Setting Up Rocket Chat",
      author: "arary",
      role: "Developer",
      community: "Developer Discussions",
      time: "2 hours ago",
      upvotes: 0,
      comments: 1,
    },
    {
      title: "RC4Community Improvements",
      author: "aumurad",
      role: "Admin",
      community: "Announcements",
      time: "4 hours ago",
      upvotes: 50,
      comments: 3,
    },
  ];

  const Item = (props) => {
    return (
      <div style={{ width: "100%", margin: "20px", textAlign: "center" }}>
        <a
          href={props.item.url}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none", color: "#000000" }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={props.item.imageUrl}
          ></img>
          <h2>{props.item.name}</h2>
        </a>
        <p style={{ color: "hsl(240, 5%, 36%)" }}>{props.item.description}</p>
      </div>
    );
  };

  const handleChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const onCarouselChange = (value) => {
    setCarouselValue(value);
  };

  const getGreetings = () => {
    let d = new Date();
    let time = d.getHours();

    if (time < 12) {
      return "Good morning";
    }
    if (time <= 17) {
      return "Good afternoon";
    }
    return "Good evening";
  };

  function onVisibleChange(isVisible) {
    if (isVisible) {
      setStartCounter(isVisible);
    }
  }

  if (!props.authState.isLoggedIn) {
    return (
      <div className="home-wrapper">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <p>Demo Mode</p>
          <RCSwitch
            checked={demoMode}
            onChange={() => setDemoMode(!demoMode)}
            name="demoMode"
          />
        </div>

        {!demoMode ? (
          <>
            <header className="unsigned-home-header">
              <h1 className="unsigned-home-heading">
                Real-time Collaboration
                <br />
                <a
                  href="http://github.com/RocketChat/RC4Community"
                  rel="noreferrer"
                  target="_blank"
                  className="powered-by-title"
                >
                  <strong>Powered by RCforCommunities</strong>
                </a>
              </h1>

              <p className="unsigned-home-text">
                <strong>Monitor</strong> your <strong>workflows</strong>,
                <strong>collaborate</strong> and <strong>access data</strong>{" "}
                any time you need it, all in one{" "}
                <strong>productivity-amplifying</strong> full-lifecycle platform
              </p>
            </header>
            <div className="rocket-logo"></div>
            <main>
              <div className="main-stats-container">
                <div className="stat-container">
                  <img
                    src="https://img.icons8.com/color/80/000000/circled-user-male-skin-type-7--v2.png"
                    alt="users"
                  />
                  <Countup end={users} className="stat-number" startCounter={true}/>
                  <div className="stat-label">Users</div>
                </div>
                <div className="stat-container">
                  <img
                    src="https://img.icons8.com/color/80/000000/filled-chat.png"
                    alt="messages"
                  />
                  <Countup end={totalMessages} className="stat-number" startCounter={true}/>
                  <div className="stat-label">Messages Exchanged</div>
                </div>
                <div className="stat-container">
                  <img
                    src="https://img.icons8.com/color/80/000000/online--v1.png"
                    alt="online-users"
                  />
                  <Countup end={onlineUsers} className="stat-number" startCounter={true} />
                  <div className="stat-label">Online Users</div>
                </div>
              </div>
              <div className="button-container">
                <Button variant="contained" color="primary" href="/login">
                  JOIN NOW TO EXPLORE MORE
                </Button>
              </div>
            </main>
          </>
        ) : (
          <>
            <header className="unsigned-home-header">
              <h1 className="unsigned-home-heading">
                Welcome to our Community
                <br />
              </h1>

              <p className="unsigned-home-text">
                <strong>Monitor</strong> your <strong>workflows</strong>,
                <strong>collaborate</strong> and <strong>access data</strong>{" "}
                any time you need it, all in one{" "}
                <strong>productivity-amplifying</strong> full-lifecycle platform
              </p>
              <br />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Select
                  variant="outlined"
                  value={searchCategory}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">All Communities</MenuItem>
                  <MenuItem value={10}>Rooms</MenuItem>
                  <MenuItem value={20}>Users</MenuItem>
                  <MenuItem value={30}>Messages</MenuItem>
                </Select>

                <TextField
                  id="search-bar"
                  placeholder="Search all content"
                  style={{ width: "50%" }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BsSearch />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="button-container">
                <Button variant="contained" color="primary" href="/login">
                  JOIN TO EXPLORE
                </Button>
              </div>
            </header>
            <h1
              style={{
                textAlign: "center",
                marginTop: "100px",
                marginBottom: "40px",
                color: "hsl(240, 6%, 17%)",
                fontWeight: "200",
              }}
            >
              Get More Done, Together!
            </h1>
            <div className="main-stats-container">
              <div className="stat-container">
                <img
                  src="https://img.icons8.com/color/80/000000/circled-user-male-skin-type-7--v2.png"
                  alt="users"
                />
                <VisibilitySensor onChange={onVisibleChange}>
                  <Countup
                    end={users}
                    className="stat-number"
                    startCounter={startCounter}
                  />
                </VisibilitySensor>
                <div className="stat-label">Users</div>
              </div>
              <div className="stat-container">
                <img
                  src="https://img.icons8.com/color/80/000000/filled-chat.png"
                  alt="messages"
                />
                <VisibilitySensor onChange={onVisibleChange}>
                  <Countup
                    end={totalMessages}
                    className="stat-number"
                    startCounter={startCounter}
                  />
                </VisibilitySensor>

                <div className="stat-label">Messages Exchanged</div>
              </div>
              <div className="stat-container">
                <img
                  src="https://img.icons8.com/color/80/000000/online--v1.png"
                  alt="online-users"
                />
                <VisibilitySensor onChange={onVisibleChange}>
                  <Countup
                    end={onlineUsers}
                    className="stat-number"
                    startCounter={startCounter}
                  />
                </VisibilitySensor>
                <div className="stat-label">Online Users</div>
              </div>
            </div>
            <h1
              style={{
                textAlign: "center",
                marginBottom: "40px",
                color: "hsl(240, 6%, 17%)",
                fontWeight: "200",
              }}
            >
              Featured Content
            </h1>
            <Carousel
              onChange={onCarouselChange}
              value={carouselValue}
              slides={carouselItems.map((item, i) => (
                <Item key={i} item={item} />
              ))}
              plugins={[
                "centered",
                "infinite",
                "arrows",
                {
                  resolve: slidesToShowPlugin,
                  options: {
                    numberOfSlides: 3,
                  },
                },
                {
                  resolve: slidesToScrollPlugin,
                  options: {
                    numberOfSlides: 1,
                  },
                },
                {
                  resolve: autoplayPlugin,
                  options: {
                    interval: 2000,
                  },
                },
              ]}
            />
            <h1
              style={{
                textAlign: "center",
                marginTop: "30px",
                marginBottom: "60px",
                color: "hsl(240, 6%, 17%)",
                fontWeight: "200",
              }}
            >
              Select Your Role
            </h1>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: "100px",
              }}
            >
              <div className="select-role-button">
                <RiAdminLine
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "20px",
                  }}
                />
                <span>Admin</span>
              </div>
              <div className="select-role-button">
                <FaLaptopCode
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "20px",
                  }}
                />
                <span>Developer</span>
              </div>
              <div className="select-role-button">
                <BsChatDots
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "20px",
                  }}
                />
                <span>Live Chat User</span>
              </div>
              <div className="select-role-button">
                <FaRegSun
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "20px",
                  }}
                />
                <span>GSoC Student</span>
              </div>
            </div>
            <div style={{ marginBottom: "60px", marginTop: "30px" }}>
              <h1>Community Activity</h1>
              {activityItems.map((item) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "80%",
                    }}
                  >
                    <img
                      src={`${rcApiDomain}/avatar/rocket.cat`}
                      style={{
                        borderRadius: "50%",
                        height: "40px",
                        width: "40px",
                        marginRight: "20px",
                      }}
                    ></img>
                    <div style={{ marginRight: "40px" }}>
                      <h3>{item.title}</h3>
                      <p style={{ color: "hsl(240, 5%, 36%)" }}>
                        by{" "}
                        <strong>
                          {item.author}({item.role})
                        </strong>{" "}
                        in <strong>{item.community}</strong> <i>{item.time}</i>{" "}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "20%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "50%",
                        alignItems: "center",
                      }}
                    >
                      <FiThumbsUp
                        style={{
                          height: "25px",
                          width: "25px",
                          marginRight: "15px",
                          marginLeft: "30px",
                        }}
                      />
                      <span>{item.upvotes}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "50%",
                        alignItems: "center",
                      }}
                    >
                      <FaRegComment
                        style={{
                          height: "25px",
                          width: "25px",
                          marginRight: "15px",
                          marginLeft: "30px",
                        }}
                      />
                      {item.comments}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  return (
    <div className="home-wrapper">
      <header class="signed-home-header">
        <h2>
          {getGreetings()}, {props.authState.user.name}
        </h2>
        <p>We're ready to go.</p>
      </header>
      <div class="signed-home-main">
        <div>
          <div class="signed-home-shortcut-container">
            <h5>Start something new</h5>
            <div
              className="signed-home-shortcut"
              onClick={() => {
                document.getElementById("create-room").click();
              }}
            >
              <img
                src="https://img.icons8.com/plasticine/35/000000/organization.png"
                className="shortcut-icon-medium"
                alt="room"
              />
              Create a room
            </div>
          </div>
          <div className="signed-home-shortcut-container">
            <h5>Explore more</h5>
            <div
              className="signed-home-shortcut"
              onClick={() => {
                document.getElementById("search").click();
              }}
            >
              <img
                src="/search-icon.png"
                className="shortcut-icon-small"
                alt="search"
              />
              Discover existing rooms
            </div>
          </div>
        </div>
        <img
          src="/community.jpg"
          className="community-home-img"
          alt="community"
        ></img>
      </div>
    </div>
  );
}
