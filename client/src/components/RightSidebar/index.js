import RoomInfo from '../RoomInfo';
import ActivityPane from './../ActivityPane';

import './index.css';

export default function RightSidebar(props) {
    return (
      <div className="rightSidebar-wrapper">
        <RoomInfo {...props} />
        <ActivityPane {...props}/>
      </div>
    );
}
