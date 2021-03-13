import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const RCSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 20,
      padding: 0,
      margin: 10,
    },
    switchBase: {
      padding: 0,
      '&$checked': {
        transform: 'translateX(20px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
      },
    },
    thumb: {
      width: 20,
      height: 20,
    },
    track: {
      display: "inline-table",
      borderRadius: 20 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  export default RCSwitch