import "./index.css";
import RoomItem from "./../RoomItem/";

export default function CommunityListItem(props) {
  const { community, community_name } = props;
  return (
    <div className="community-wrapper">
      <div className="community-title">{community_name}</div>
      {community.map((room) => {
        // Here the second condition holds when new room is created as the response from server doesn't return open field on creation
        if (room.open || room.open === undefined)
          return <RoomItem room={room} key={room._id}></RoomItem>;
      })}
    </div>
  );
}
