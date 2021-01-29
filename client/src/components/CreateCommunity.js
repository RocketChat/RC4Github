import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Link, Redirect} from 'react-router-dom'
import { DialogTitle } from '@material-ui/core';
import RCSwitch from './RCSwitch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Cookies from 'js-cookie'
import {AuthContext} from '../App'



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = (theme) => ({
  root: {
    width: '100%',
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px"
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
});

class CreateCommunity extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      repositories: [],
      organizations: [],
      openChannelDialog: false,
      openCommunityDialog: false,
      username: {group: "User", value: "RonLek"}, // TODO: Get from cookies
      community: null,
      includePrivateRepositories: false,
      publicChannel: true,
      authToken: '15d5f45a2d454f76a72f31ff2a4689c88d18e91b'
    }
  }

  fetchRepositories = () => {
    const {includePrivateRepositories, username, authToken} = this.state
    axios.get('http://localhost:3030/getRepositories', {
        params: {
          username: username,
          includePrivateRepositories: includePrivateRepositories,
          authToken: authToken
        }
      })
      .then((response) => {
        // handle success
        this.setState({repositories: response.data})
      })
      .catch((error) => {
        // handle error
        console.log("Error = ", error);
      })
  }

  fetchOrganizations = () => {
    const {authToken} = this.state
    console.log("Auth token = ", authToken)
    axios.get('http://localhost:3030/getOrganizations', {
        params: {
          authToken: authToken
        }
      })
      .then((response) => {
        // handle success
        this.setState({organizations: response.data.map(organization => {
          return {group: "Organization", value: organization.login}
        }
          )})
      })
      .catch((error) => {
        // handle error
        console.log("Error = ", error);
      })
  }

  handleClickChannelDialog = () => {
    this.setState({openChannelDialog: true})
    this.fetchRepositories()
  };

  handleClickCommunityDialog = () => {
    this.setState({openCommunityDialog: true})
    this.fetchOrganizations()
  };

  handleCloseChannelDialog = () => {
    this.setState({openChannelDialog: false})
  };

  handleCloseCommunityDialog = () => {
    this.setState({openCommunityDialog: false})
  };

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value
  });
  }

  handleAllRepositories = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
    console.log("Included")
  };

  handleRepoSelect = (e) => {
    this.setState({
      channel: e.target.value
  });
}

  handleCreateCommunity = () => {
    const {community, authToken} = this.state
    var communityMembers = []
    if(community.group === "Organization")
    {
      const headers = {
        accept: 'application/vnd.github.v3+json',
        Authorization: `token ${authToken}`
    }
      axios.get(`https://api.github.com/orgs/${community.value}/members`, {
        headers: headers
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        // handle error
        console.log("Error = ", error);
      })
    }
  }

  render() {
    const {openChannelDialog, repositories, publicChannel, includePrivateRepositories, openCommunityDialog ,organizations, username, community } = this.state
    const {classes} = this.props 
    const client_id = 'c37468a543a69c4220a2'
    console.log("community = ", community)

  return (
    <div style={{justifyContent:"center", display:"flex"}}>
      <Button style={{margin:"50px"}} variant="outlined" color="primary" onClick={this.handleClickChannelDialog}>
        Create Channel
      </Button>
      <Button style={{margin:"50px"}} variant="outlined" color="primary" onClick={this.handleClickCommunityDialog}>
        Create Community
      </Button>

      <Dialog
        open={openCommunityDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleCloseCommunityDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth = "true"
      >
        <DialogTitle>
          <p style={{fontSize:"20px"}}>Create a New Community</p>
          <p style={{fontSize:"15px", color:"#8e9299"}}>Communities form an umbrella for your channels.</p>
        </DialogTitle>
        <DialogContent>
    <div className={classes.root}>
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
        {community && 
        (
          <>
          <br/>
        <p style={{color:"#8e9299"}}>Your community would be created as <strong>{community.value.concat("/community")}</strong></p>
        </>
        )}
        <br/>
      <Button disabled={!community} style={{width: "15%"}} onClick={this.handleCreateCommunity} variant="contained" color="primary">
        Create
      </Button>
    </div>
    </DialogContent>
    </Dialog>

    <Dialog
        open={openChannelDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleCloseChannelDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth = "true"
      >
        <DialogTitle>
          Create a New Channel
        </DialogTitle>
        <DialogContent>
          <p style={{color:"#c0c2c6"}}>Channels are where your teams communicate.</p>
    <div className={classes.root}>
    <FormControlLabel
        control={<RCSwitch checked={publicChannel} onChange={() => this.setState({publicChannel: !publicChannel})} name="publicChannel" />}
        label="Public Channel"
      />
      <p style={{color:"#c0c2c6"}}>{publicChannel?"Everyone can access this channel.":"Just invited people can access this channel."}</p>
    <FormControlLabel
        control={<RCSwitch checked={this.state.includePrivateRepositories} onChange={this.handleAllRepositories} name="includePrivateRepositories" />}
        label="Show All Repositories"
      />
      <a href={`https://github.com/login/oauth/authorize?scope=repo&client_id=${client_id}`}>Include Private Repositories</a>
      <p style={{color:"#c0c2c6"}}>Show public {includePrivateRepositories? "and private ":""}repositories.</p>
      
      <p>Select a community</p>
      <Autocomplete
            id="combo-box-repo"
            options={organizations.concat(username).sort((a,b) => -a.group.localeCompare(b.group))}
            getOptionLabel={(option) => option.value}
            style={{ width: 300 }}
            onChange={(event, value) => {this.setState({community: value})
          }}
            renderInput={(params) => <TextField {...params} label="Community" variant="outlined" />}
        >
        </Autocomplete>
        <br/>
      <Autocomplete
            id="combo-box-repo"
            options={repositories}
            style={{ width: 300 }}
            onChange={(event, value) => {this.setState({channel: value})
          }}
            renderInput={(params) => <TextField {...params} label="Repositories" variant="outlined" />}
          />
    </div>
    </DialogContent>
    </Dialog>

      </div>
  );
        }

}

export default withStyles(useStyles)(CreateCommunity)