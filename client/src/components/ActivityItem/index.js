export default function ActivityItem({event, repo}) {
    const { sender, resource, action, updated_at } = event;
    return (
      <div className="activity-item-wrapper">
        <a href={`https://github.com/${sender.username}`}>{sender.username}</a>
        <span>{action}</span>
        <a href={`https://github.com/${repo}/issues/${resource.number}`}>
          #{resource.number}
        </a>
        <span>{updated_at}</span>
      </div>
    );
}
