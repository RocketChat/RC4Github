import React from 'react';
import { RiHome4Line, RiSearchLine } from "react-icons/ri";
import {AiOutlineGlobal} from "react-icons/ai";
import {IoCreateOutline} from "react-icons/io5";
import {CgHashtag, CgCommunity} from "react-icons/cg"
import {HiSortDescending} from "react-icons/hi";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Cookies from "js-cookie";
import CreateCommunity from "../CreateCommunity/"
import CreateChannel from "../CreateChannel/"
import axios from 'axios'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function LeftSidebar() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openCommunityDialog, setopenCommunityDialog] = React.useState(false);
    const [openChannelDialog, setopenChannelDialog] = React.useState(false);
    const [organizations, setOrganizations] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
    const [snackbarText, setSnackbarText] = React.useState("");


    const handleCloseCommunityDialog = () => {
      setopenCommunityDialog(false)
    };

    const handleCloseChannelDialog = () => {
      setopenChannelDialog(false)
    };

    const handleCreateClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCreateClose = () => {
      setAnchorEl(null);
    };

    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false)
    }

    const setSnackbar = (snackbarOpen, snackbarSeverity, snackbarText) => {
      setSnackbarOpen(snackbarOpen)
      setSnackbarSeverity(snackbarSeverity)
      setSnackbarText(snackbarText)
    }

    const fetchOrganizations = async () => {
      try
      {
          const authToken = Cookies.get('gh_login_token')
          const headers = {
              accept: 'application/vnd.github.v3+json',
              Authorization: `token ${authToken}`
          }  
  
          const ghOrgResponse = await axios({
              method: 'get',
              url: `https://api.github.com/user/orgs`,
              headers: headers
          })
  
          const organizations = ghOrgResponse.data.map(organization => {
              return {group: "Organization", value: organization.login}
          }
              )
          setOrganizations(organizations)
      }
      catch (error)
      {
          console.log(error)
      }
      
    }

    return (
      <div className="signed-left-sidebar-wrapper">
        <div className="signed-left-sidebar-header">
          <img className="left-sidebar-user-avatar" alt={"username"}></img>
          <div className="left-sidebar-control">
            <RiHome4Line className="left-sidebar-control-icons"></RiHome4Line>
            <RiSearchLine className="left-sidebar-control-icons"></RiSearchLine>
            <AiOutlineGlobal className="left-sidebar-control-icons"></AiOutlineGlobal>
            <HiSortDescending className="left-sidebar-control-icons"></HiSortDescending>
            <IoCreateOutline 
            aria-controls="create-menu" 
            aria-haspopup="true" 
            className="left-sidebar-control-icons"
            onClick={handleCreateClick}></IoCreateOutline>
          </div>
          <Menu
            id="create-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCreateClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem 
              onClick={() => {
              fetchOrganizations()
              setopenCommunityDialog(true)
              handleCreateClose()
              }}>
                <CgCommunity color="#000" className="create-menu-icons"/>
                Community
            </MenuItem>
            <MenuItem onClick={() => {
              fetchOrganizations()
              setopenChannelDialog(true)
              handleCreateClose()}}>
                <CgHashtag color="#000" className="create-menu-icons"/>
                Channel
            </MenuItem>
          </Menu>
        </div>
        {openCommunityDialog && 
        <CreateCommunity 
        handleCloseCommunityDialog = {handleCloseCommunityDialog}
        organizations={organizations}
        setSnackbar={setSnackbar}/>
        }
        {openChannelDialog && 
        <CreateChannel 
        handleCloseChannelDialog = {handleCloseChannelDialog}
        organizations={organizations}
        setSnackbar={setSnackbar}/>
        }
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={3000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
              <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarText}
              </Alert>
        </Snackbar>
        <hr className="left-sidebar-divider"></hr>
        <div className="signed-left-sidebar-body"></div>
        <div className="signed-left-sidebar-footer"></div>
      </div>
    );
}
