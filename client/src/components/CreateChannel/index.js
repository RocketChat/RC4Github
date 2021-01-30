import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DialogTitle } from '@material-ui/core';
import RCSwitch from '../RCSwitch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Cookies from 'js-cookie'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import jwt_decode from "jwt-decode";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default class CreateChannel extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      repositories: [],
      publicRepositories: [],
      privateRepositories: [],
      organizations: [],
      openChannelDialog: false,
      username: jwt_decode(Cookies.get('rc4git_token')).username.slice(0, -7),
      community: null,
      includePrivateRepositories: false,
      publicChannel: true,
      loading: false,
      communities: [],
      organizations: [],
      channel: null,
      snackbarOpen: false,
      snackbarText: ""
    }
  }

  componentDidMount() {
      this.fetchOrganizations()
  }

  fetchOrganizations = async () => {
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
        this.setState({organizations: organizations})
    }
    catch (error)
    {
        console.log(error)
    }
    
  }

  handleClickChannelDialog = async () => {
    const {publicRepositories, privateRepositories, organizations, username} = this.state
    let communityChannels = [], communityMember = []

    this.setState({openChannelDialog: true})

    //Gets community channels user is part of
    const rcUserInfoResponse = await axios({
        method: 'get',
        url: `http://localhost:3030/userInfo`,
        params: {
            rc_token: Cookies.get('rc_token'),
            rc_uid: Cookies.get('rc_uid')
        }
    })

    communityChannels = rcUserInfoResponse.data.data.user.rooms.filter((room) => {
        return room.name.endsWith("_community")
    }).map((communityRoom) => communityRoom.name.slice(0, communityRoom.name.length - 10))

    //Add organizations and username to communityMember
    communityMember.push(username)
    communityMember = communityMember.concat(organizations.map(organization => organization.value))

    //Intersect communityMembers and communityChannels and set as communities
    this.setState({communities: communityMember.filter(value => communityChannels.includes(value))})
    
    //Fetch public repositories
    const publicRepoResponse = await axios({
        method: 'get',
        url: `https://api.github.com/user/repos?visibility=public&affiliation=owner,organization_member`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${Cookies.get('gh_login_token')}`
            },
        params: {
            per_page: 100
        }  
    })
    publicRepoResponse.data.map(repository =>
        publicRepositories.push(repository.full_name)
      )

      //TODO: Also add for whenever state is open from props
    if(Cookies.get('gh_private_repo_token'))
    {
        const privateRepoResponse = await axios({
            method: 'get',
            url: `https://api.github.com/user/repos?visibility=private&affiliation=owner,organization_member`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${Cookies.get('gh_private_repo_token')}`
                },
            params: {
                per_page: 100
            }  
        })
        privateRepoResponse.data.map(repository =>
            privateRepositories.push(repository.full_name)
          )
    }
    this.setState({repositories: publicRepositories})
  };

  handleCloseChannelDialog = () => {
    this.setState({openChannelDialog: false})
  };
  
  handleAllRepositories = async (event) => {
        const {publicRepositories, privateRepositories} = this.state
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
        if(event.target.checked)
        {
            
            if(!Cookies.get('gh_private_repo_token'))
            {
                document.getElementById('scope-upgrade-link').click()
            }
            this.setState({repositories: publicRepositories.concat(privateRepositories)})
        }
        else
        {
            this.setState({repositories: publicRepositories})
        }
  }

  handleCreateChannel = async () => {
    const {channel, community, publicChannel} = this.state
    const authToken = Cookies.get('gh_private_repo_token')?Cookies.get('gh_private_repo_token'):Cookies.get('gh_login_token')
    let collaborators = [], description = ""
    this.setState({loading: true})
    //Populate collaborators for the repo
    try
    {
        const ghCollaboratorsResponse = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${community}/${channel}/collaborators`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${authToken}`
                },
            params: {
                per_page: 100
            }  
        })
        ghCollaboratorsResponse.data.map((member) => {
            collaborators.push(member.login.concat("_github_rc4git"))
        })

        const ghRepoResponse = await axios({
            method: 'get',
            url: `https://api.github.com/repos/${community}/${channel}`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${authToken}`
                }
        })

        description = ghRepoResponse.data.description

        const rcCreateChannelResponse = await axios({
            method: 'post',
            url: `http://localhost:3030/createChannel`,
            data: {
                rc_token: Cookies.get('rc_token'),
                rc_uid: Cookies.get('rc_uid'),
                channel: `${community}_${channel}`,
                members: collaborators,
                description: description,
                topic: `GitHub: https://github.com/${community}/${channel}`,
                type: publicChannel ? "c": "p"
            }
        })
        if(rcCreateChannelResponse.data.data.success)
        {
            this.setState({loading: false,
                 openChannelDialog: false,
                  snackbarOpen: true,
                   snackbarSeverity: "success",
                    snackbarText: "Channel created successfully!"})
        }
        else
        {
            this.setState({loading:false,
                 snackbarOpen: true,
                  snackbarSeverity: "error",
                   snackbarText: "Error Creating Channel!"})
        }
    } 
    catch(error)
    {
        console.log(error)
        this.setState({loading:false,
            snackbarOpen: true,
            snackbarSeverity: "error",
             snackbarText: "Error Creating Channel!"})
    }
    
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
      }
  
      this.setState({snackbarOpen: false})
  }

  render() {
    const {openChannelDialog, repositories, publicChannel, includePrivateRepositories,
         community, communities, channel, loading, snackbarOpen, snackbarSeverity, snackbarText } = this.state
    
  return (
    <div style={{justifyContent:"center", display:"flex"}}>
      <Button style={{margin:"50px"}} variant="outlined" color="primary" onClick={this.handleClickChannelDialog}>
        Create Channel
      </Button>
      <a
            id="scope-upgrade-link"
            href="https://github.com/login/oauth/authorize?scope=repo&client_id=1daf5ba8a06418180a31"
          />

    <Dialog
        open={openChannelDialog}
        keepMounted
        onClose={this.handleCloseChannelDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth = "true"
      >
        <DialogTitle>
          Create a New Channel
        </DialogTitle>
        <DialogContent>
          <p style={{color:"#c0c2c6"}}>Channels are where your teams communicate.</p>
    <div>
    <br/>
    <p>Select a community</p>
      <Autocomplete
            id="combo-box-repo"
            options={communities}
            style={{ width: 300 }}
            onChange={(event, value) => {this.setState({community: value})
          }}
            renderInput={(params) => <TextField {...params} label="Community" variant="outlined" />}
        />
        <br/>
        <br/>
        <FormControlLabel
        control={<RCSwitch checked={publicChannel} onChange={() => this.setState({publicChannel: !publicChannel})} name="publicChannel" />}
        label="Public Channel"
      />
      <p style={{color:"#c0c2c6"}}>{publicChannel?"Everyone can access this channel.":"Just invited people can access this channel."}</p>
          <br/>
        <FormControlLabel
        control={<RCSwitch checked={this.state.includePrivateRepositories} onChange={this.handleAllRepositories} name="includePrivateRepositories" />}
        label="Show All Repositories"
      />
      <p style={{color:"#c0c2c6"}}>Show public {includePrivateRepositories? "and private ":""}repositories.</p>
      <br/>
        <p>Select a repository</p>
      <Autocomplete
            id="combo-box-repo"
            options={community? 
                repositories.filter(repository => repository.startsWith(community.concat("/")))
                .map(repository => repository.slice(community.length + 1, repository.length))
                .sort(): []}
            style={{ width: 300 }}
            onChange={(event, value) => {this.setState({channel: value})
          }}
            renderInput={(params) => <TextField {...params} label="Repositories" variant="outlined" />}
          />
          <br/>
          {channel && 
        (
          <>
        <p style={{color:"#8e9299"}}>Your channel would be created as <strong>{community.concat(`_${channel}`)}</strong></p>
        </>
        )}
        <br/>
      <Button 
      disabled={!channel || loading}  
      onClick={this.handleCreateChannel} 
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
    <Snackbar 
    open={snackbarOpen} 
    autoHideDuration={3000} 
    onClose={this.handleSnackbarClose}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={this.handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarText}
        </Alert>
    </Snackbar>

      </div>
  );
        }

}