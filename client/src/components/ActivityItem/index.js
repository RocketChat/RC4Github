import {DiGithubBadge} from "react-icons/di";

import "./index.css";

export default function ActivityItem({event, repo}) {
    const { sender, resource, action, updated_at } = event;
    return (
      <div className="activity-item-wrapper">
        <div className="activity-event-info">
          <DiGithubBadge className="activity-item-vcs-badge" />
          <a href={`https://github.com/${sender.username}`} target="_blank">
            {sender.username}
          </a>
          <span>&nbsp;{`${action} `}&nbsp;</span>
          <a
            href={`https://github.com/${repo}/issues/${resource.number}`}
            target="_blank"
          >
            #{resource.number}
          </a>
        </div>
        <span className="activity-event-time">{`${new Date(
          updated_at
        ).getHours() < 10
        ? `0${new Date(updated_at).getHours()}`
        : new Date(updated_at).getHours()}:${
          new Date(updated_at).getMinutes() < 10
            ? `0${new Date(updated_at).getMinutes()}`
            : new Date(updated_at).getMinutes()
        }`}</span>
      </div>
    );
}
