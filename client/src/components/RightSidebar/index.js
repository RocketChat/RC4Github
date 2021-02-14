import ActivityPane from './../ActivityPane';

import './index.css';

export default function RightSidebar(props) {
    return (
      <div className="rightSidebar-wrapper">
        <ActivityPane {...props}/>
      </div>
    );
}
