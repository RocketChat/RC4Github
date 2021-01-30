import { RiHome4Line, RiSearchLine } from "react-icons/ri";
import {AiOutlineGlobal} from "react-icons/ai";
import {IoCreateOutline} from "react-icons/io5";
import {HiSortDescending} from "react-icons/hi";

export default function LeftSidebar() {
    return (
      <div className="signed-left-sidebar-wrapper">
        <div className="signed-left-sidebar-header">
          <img className="left-sidebar-user-avatar" alt={"username"}></img>
          <div className="left-sidebar-control">
            <RiHome4Line className="left-sidebar-control-icons"></RiHome4Line>
            <RiSearchLine className="left-sidebar-control-icons"></RiSearchLine>
            <AiOutlineGlobal className="left-sidebar-control-icons"></AiOutlineGlobal>
            <HiSortDescending className="left-sidebar-control-icons"></HiSortDescending>
            <IoCreateOutline className="left-sidebar-control-icons"></IoCreateOutline>
          </div>
        </div>
        <hr className="left-sidebar-divider"></hr>
        <div className="signed-left-sidebar-body"></div>
        <div className="signed-left-sidebar-footer"></div>
      </div>
    );
}
