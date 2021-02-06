import React, { Component } from 'react';
import axios from 'axios'
import { Autocomplete } from '@material-ui/lab';
import { Button, Dialog, DialogTitle, DialogContent, Slide, TextField, CircularProgress } from '@material-ui/core';
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import { rcApiDomain, rc4gitApiDomain } from '../../utils/constants';
import EmbedBadgeDialog from '../EmbedBadgeDialog'


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
      showEmbedBadgeDialog: false,
      room: null,
      openCreateCommunityDialog: true
    }
  }

  handleCreateCommunity = async () => {
    const {community} = this.state
    const {setSnackbar, addRoom} = this.props
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

            description = ghOrgResponse.data.description ? ghOrgResponse.data.description: ""

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

            description = ghUserResponse.data.bio ? ghUserResponse.data.bio: ""
        }
        const rcCreateChannelResponse = await axios({
            method: 'post',
            url: `${rc4gitApiDomain}/createChannel`,
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
            //Add embeddable code for channel to description
            description = description
            .concat(`

-----
Embed this community
<pre><code>&lt;a&nbsp;href=\&quot;http://localhost:3002/channel/${room.name}&quot;&gt;
&lt;img&nbsp;src=&quot;${rcApiDomain}/images/join-chat.svg&quot;/&gt;
&lt;/a&gt;</code></pre>
`)
            await axios({
              method: 'post',
              url: `${rcApiDomain}/api/v1/channels.setDescription`,
              headers: {
                'X-Auth-Token': Cookies.get('rc_token'),
                'X-User-Id': Cookies.get('rc_uid'),
                'Content-type': 'application/json'
            },
              data: { 
                  'roomId': room._id,
                  'description': description 
              },
            })
            addRoom(room);
            setSnackbar(true, "success", "Community created successfully!")
            this.setState({loading: false, room: room, openCreateCommunityDialog: false, showEmbedBadgeDialog: true})
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
    const {username, community, loading, openCreateCommunityDialog, showEmbedBadgeDialog, room} = this.state
    const {setSnackbar, organizations, handleEndCreateCommunity} = this.props

    return (
    <div style={{justifyContent:"center", display:"flex"}}>

      <Dialog
        open={openCreateCommunityDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleEndCreateCommunity}
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
    {showEmbedBadgeDialog && 
      <EmbedBadgeDialog
        channelURL={`http://localhost:3002/channel/${room.name}`}
        createType="community"
        setSnackbar={setSnackbar}
        endCreate={handleEndCreateCommunity}
      />}
      </div>
  );
        }

}