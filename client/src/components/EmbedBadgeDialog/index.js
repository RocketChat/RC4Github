import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Slide
} from "@material-ui/core";
import { MdContentCopy } from "react-icons/md";
import SyntaxHighlighter from "react-syntax-highlighter";
import CopyToClipboard from "react-copy-to-clipboard";
import { rcApiDomain } from '../../utils/constants';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class EmbedBadgeDialog extends Component  {

  constructor(props)
  {
    super(props)
    this.state = {
      embedCodeString: `<a href="${props.channelURL}">
  <img src="${rcApiDomain}/images/join-chat.svg" />
</a>`
    }
  }

  render() {
    const {channelURL, createdType, setSnackbar, endCreate} = this.props
    const {embedCodeString} = this.state
    return(
      <Dialog
      open={true}
      keepMounted
      onClose={() => endCreate(true)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>Add a Rocket Chat Badge </DialogTitle>
      <DialogContent>
        <a href={channelURL}>
          <img alt="Embed Badge" src={`${rcApiDomain}/images/join-chat.svg`} />
        </a>
        <br />
        <br />
        <p>
          Embed a Rocket Chat badge and launch your {createdType} right from
          your repositories 🚀{" "}
        </p>
        <div className="code-copy-icon-div">
          <CopyToClipboard text={embedCodeString}>
            <MdContentCopy
              title="Copy to Clipboard"
              className="code-copy-icon"
              onClick={() => {
                setSnackbar(true, "success", "Copied to Clipboard!");
              }}
            />
          </CopyToClipboard>
        </div>
        <SyntaxHighlighter language="html" id="syntax-highlight">
          {embedCodeString}
        </SyntaxHighlighter>
        <br />
        <Button
          onClick={() => endCreate(true)}
          style={{ marginBottom: "10px" }}
          variant="contained"
          color="primary"
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
    )
  }
    
}