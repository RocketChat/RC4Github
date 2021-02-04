import React, { Component } from 'react';
import axios from 'axios'
import { Autocomplete } from '@material-ui/lab';
import { Button, Dialog, DialogTitle, DialogContent, Slide, TextField, CircularProgress } from '@material-ui/core';
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import { rcApiDomain } from '../../utils/constants';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class CreateCommunity extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      repositories: [],
      username: {group: "User", value: jwt_decode(Cookies.get('rc4git_token')).username.slice(0, -7)},
      community: null,
      loading: false,
    }
  }

  handleCreateCommunity = async () => {
    const {community} = this.state
    const {handleCloseCommunityDialog, setSnackbar, addRoom, setEmbedDialog} = this.props
    const authToken = Cookies.get('gh_login_token')
    let communityMembers = [], description = ""
    this.setState({loading: true})
    //Populate communityMembers if group is Organization
    try
    {
        if(community.group === "Organization")
        {
            const ghMembersResponse = await axios({
                method: 'get',
                url: `https://api.github.com/orgs/${community.value}/members`,
                headers: {
                    accept: 'application/json',
                    Authorization: `token ${authToken}`
                    },
                params: {
                    per_page: 100
                }  
            })
            ghMembersResponse.data.map((member) => (
                communityMembers.push(member.login.concat("_github_rc4git"))
            ))

            const ghOrgResponse = await axios({
                method: 'get',
                url: `https://api.github.com/orgs/${community.value}`,
                headers: {
                    accept: 'application/json',
                    Authorization: `token ${authToken}`
                    }
            })

            description = ghOrgResponse.data.description

        }
        else
        {
            const ghUserResponse = await axios({
                method: 'get',
                url: `https://api.github.com/user`,
                headers: {
                    accept: 'application/json',
                    Authorization: `token ${authToken}`
                    }
            })

            description = ghUserResponse.data.bio
        }
        const rcCreateChannelResponse = await axios({
            method: 'post',
            url: `http://localhost:3030/createChannel`,
            data: {
                rc_token: Cookies.get('rc_token'),
                rc_uid: Cookies.get('rc_uid'),
                channel: community.value.concat('_community'),
                members: communityMembers,
                description: description,
                topic: `GitHub: https://github.com/${community.value}`,
                type: "c"
            }
        })
        if(rcCreateChannelResponse.data.data.success)
        {
            let room = rcCreateChannelResponse.data.data.channel;
            room.rid = room._id;
            //Add embeddable code for channel to description
            description = description
            .concat(`

-----
Embed this community
<pre><code>\&lt;a\&nbsp;href=\&quot;http://localhost:3002/channel/${room.name}\&quot;\&gt;
\&lt;img\&nbsp;src=\&quot;${rcApiDomain}/images/join-chat.svg\&quot;/\&gt;
\&lt;/a\&gt;</code></pre>
`)
            await axios({
              method: 'post',
              url: `http://localhost:3030/setChannelDescription`,
              data: {
                  rc_token: Cookies.get('rc_token'),
                  rc_uid: Cookies.get('rc_uid'),
                  roomId: room.rid,
                  description: description
              }
            })
            addRoom(room);
            this.setState({loading: false})
            handleCloseCommunityDialog()
            setSnackbar(true, "success", "Community created successfully!")
            setEmbedDialog(true, `http://localhost:3002/channel/${room.name}`, "community")
        }
        else
        {
            this.setState({loading:false})
            setSnackbar(true, "error", "Error Creating Community!")
        }
    } 
    catch(error)
    {
        console.log(error)
        this.setState({loading:false})
        setSnackbar(true, "error", "Error Creating Community!")
    }
    
  }

  render() {
    const {username, community, loading} = this.state
    const {handleCloseCommunityDialog, organizations} = this.props

    return (
    <div style={{justifyContent:"center", display:"flex"}}>

      <Dialog
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseCommunityDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>
          <p style={{fontSize:"20px"}}>Create a New Community</p>
          <p style={{fontSize:"15px", color:"#8e9299"}}>Communities form an umbrella for your channels.</p>
        </DialogTitle>
        <DialogContent>
    <div >
      <p>Select a community</p>
      <Autocomplete
            id="combo-box-repo"
            options={organizations.concat(username).sort((a,b) => -a.group.localeCompare(b.group))}
            getOptionLabel={(option) => option.value}
            groupBy={(option) => option.group}
            style={{ width: 300 }}
            onChange={(event, value) => {this.setState({community: value})
          }}
            renderInput={(params) => <TextField {...params} label="Community" variant="outlined" />}
        >
        </Autocomplete>
        <br/>
        {community && 
        (
          <>
        <p style={{color:"#8e9299"}}>Your community would be created as <strong>{community.value.concat("_community")}</strong></p>
        </>
        )}
        <br/>
      <Button 
      disabled={!community || loading}  
      onClick={this.handleCreateCommunity} 
      style={{marginBottom: "10px"}}
      variant="contained" 
      color="primary"
      startIcon={loading &&
        <CircularProgress size={14} color="secondary"/>}>
        {loading? 'Creating': 'Create'}
      </Button>
    </div>
    </DialogContent>
    </Dialog>

      </div>
  );
        }

}