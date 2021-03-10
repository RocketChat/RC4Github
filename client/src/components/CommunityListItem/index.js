import "./index.css"
import RoomItem from "./../RoomItem/";

export default function CommunityListItem(props) {
  const { community, community_name } = props;
  return (
    <div className="community-wrapper">
      <div className="community-title">{community_name}</div>
      {community && Object.keys(community).map((roomId) => {
        let room = community[roomId];
        if (room.open || room.open === undefined)
          // Here the second condition holds when new room is created as the response from server doesn't return open field on creation
          return <RoomItem room={room} key={room._id}></RoomItem>;
        return null;
      })}
    </div>
  );
}
