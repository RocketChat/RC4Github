import { rc4gitApiDomain } from "../../utils/constants";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import ActivityItem from './../ActivityItem';

export default function ActivityPane(props) {
  const [webhookId, setWebhookId] = useState(null);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch(
      `${rc4gitApiDomain}/webhooks?room_name=${
        props.location.pathname.split("/")[2]
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("rc4git_token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setWebhookId(data.data.hook_id || null);
      })
      .catch((error) => console.log(error));
  });
  useEffect(() => {
    if (webhookId) {
      let activityConnection = new EventSource(
        `${rc4gitApiDomain}/activities/github?hook_id=${webhookId}`,
        { withCredentials: true }
      );
      activityConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(Array.isArray(data)){
            setEvents(data);
        } else {
            setEvents((events) => [data, ...events]);
        }
      };
      return () => {
        console.log("CLOSED");
        activityConnection.close();
      };
    }
  }, [webhookId]);
  return (
    <div>
      <div>
        <span>Activity</span>
      </div>
      <hr className="left-sidebar-divider"></hr>
      <div>
        {webhookId && events.map((event) => {
          return (
            <ActivityItem
              key={event._id}
              event={event}
              repo={props.location.pathname.split("/")[2]}
            />
          );
        })}
      </div>
    </div>
  );
}
