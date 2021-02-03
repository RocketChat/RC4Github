import "./index.css"
import RoomItem from "./../RoomItem/";

export default function CommunityListItem(props) {
    const { community, community_name } = props;
    return (
      <div className="community-wrapper">
        <div className="community-title">{community_name}</div>
        {community.map((room) => {
            return <RoomItem room={room} key={room.rid}></RoomItem>
        })}
      </div>
    );
}
