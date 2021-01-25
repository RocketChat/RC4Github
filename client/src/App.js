import './App.css';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import githubIcon from './images/github-icon.png'
import gitlabIcon from './images/gitlab-icon.png'
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Link} from 'react-router-dom'



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = (theme) => ({
  root: {
    width: '100%',
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

class App extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      repositories: [],
      activeStep: 0,
      open: false,
      repoHost: 'github',
      steps: this.getSteps(),
      username: "",
      channel: ""
    }
  }

  getSteps = () => {
    return ['Select Repository Host', 'Enter Username', 'Choose Repository'];
  } 

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleNext = () => {
    const {activeStep, steps, channel, username} = this.state
    if(activeStep === 1)
    { 

      axios.get('http://localhost:3030/getRepositories', {
        params: {
          username: username
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
    else if (activeStep === (steps.length - 1)) 
    {
      axios({
        method: 'post',
        url: 'http://localhost:3030/createChannel',
        params:{channel: channel}
      })
      .then((response) => {
       // handle success
       alert("Channel Created Successfully")
      })
      .catch((error) => {
        // handle error
        console.log("Error = ", error);
      })
    }
    this.setState({activeStep: this.state.activeStep + 1});
  };

  handleBack = () => {
    this.setState({activeStep: this.state.activeStep - 1});

  };

  handleReset = () => {
    this.setState({activeStep: 0});

  };

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value
  });
  }

  handleRepoSelect = (e) => {
    this.setState({
      channel: e.target.value
  });
}

  repoHostSelect = (host) => {
    this.setState({repoHost: host});
    this.handleNext()
  };

  getStepContent = (step) => {
    const {repositories, username} = this.state
    const {classes} = this.props
    switch (step) {
      case 0:
        return (
          <div style={{display:"flex", margin:"50px 30px" ,justifyContent:"center", alignItems:"center"}}>
          <Box display="flex" justifyContent="space-between" width="50%">
            <Avatar onClick={() => this.repoHostSelect('github')} className={classes.medium} src={githubIcon}/>
            <Avatar onClick={() => this.repoHostSelect('gitlab')} className={classes.medium} src={gitlabIcon}/>
          </Box>
          </div>
        )
      case 1:
        return (
          <div style={{display:"flex", justifyContent:"center", marginBottom:"20px"}}> 
            <TextField id="standard-basic" label="Enter Username" onChange={this.handleUsernameChange} />
            </div>
        )
      case 2:
        return (
          <div style={{display:"flex", justifyContent:"center", marginBottom:"20px"}}> 
          <Autocomplete
            id="combo-box-repo"
            options={repositories}
            style={{ width: 300 }}
            onChange={(event, value) => {this.setState({channel: value})
          }}
            renderInput={(params) => <TextField {...params} label="Repositories" variant="outlined" />}
          />
          </div>

        )
      default:
        return 'Unknown step';
    }
  }

  render() {
    const {activeStep, open, repoHost, steps, channel } = this.state
    const {classes} = this.props 
  return (
    <div style={{justifyContent:"center", display:"flex"}}>
      <Button style={{margin:"50px"}} variant="outlined" color="primary" onClick={this.handleClickOpen}>
        Authenticated User
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth = "true"
      >
        <DialogContent>
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            {channel &&
            <Typography className={classes.instructions}>
              Click to go to <Link to={'/channel/' + channel}>channel created</Link>
            </Typography>
              }
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </DialogContent>
    </Dialog>
      </div>
  );
        }

}

export default withStyles(useStyles)(App)