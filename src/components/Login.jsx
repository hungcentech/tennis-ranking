// -----------------------------------------------------------------------------

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Avatar,
  Grid,
  Typography,
  Fab
} from "@material-ui/core";
import { Cancel as CloseIcon, Facebook as LoginIcon } from "@material-ui/icons";

import conf from "../conf";
import { blue } from "@material-ui/core/colors";

// -----------------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// -----------------------------------------------------------------------------

const styles = theme => ({
  avatar_xs: {
    margin: theme.spacing(4, 2, 2),
    width: theme.spacing(12),
    height: theme.spacing(12),
    background: `radial-gradient(center, ${theme.palette.grey[100]}, ${theme.palette.grey[900]})`
  },
  name_xs: {
    margin: theme.spacing(0, 2),
    width: theme.spacing(12),
    textAlign: "center"
  },
  avatar_sm: {
    margin: theme.spacing(4, 4, 2),
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  name_sm: {
    margin: theme.spacing(0, 4),
    width: theme.spacing(12),
    textAlign: "center"
  },
  title: {
    margin: theme.spacing(2, 2),
    color: theme.palette.primary.main
  },
  content: {
    margin: theme.spacing(2, 2)
  },
  actions: {
    margin: theme.spacing(2, 2)
  },
  button: {
    marginRight: theme.spacing(1)
  }
});

// -----------------------------------------------------------------------------

const LoginDialog = withStyles(styles)(({ classes, open, setOpen }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    dispatch({
      type: "user_update",
      payload: undefined
    });

    setOpen(false);
  };

  const down400 = useMediaQuery("(max-width:400px)");

  return (
    <div>
      <Dialog
        maxWidth={"xs"}
        fullWidth={false}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Avatar
              alt={user && user.name ? user.name : ""}
              src={user && user.avatar ? user.avatar : ""}
              className={down400 ? classes.avatar_xs : classes.avatar_sm}
            />
            <Typography className={down400 ? classes.name_xs : classes.name_sm}>
              {user && user.name ? `${user.name}` : ""}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {/* <DialogTitle id="alert-dialog-slide-title">{user && user.name ? `${user.name}` : ""}</DialogTitle> */}
            <DialogTitle className={classes.title} id="alert-dialog-slide-title">
              {"Login"}
            </DialogTitle>
            <DialogContent className={classes.content}>
              <DialogContentText id="alert-dialog-slide-description">Please login to continue...</DialogContentText>
            </DialogContent>
          </Grid>
          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Fab variant="extended" size="medium" href={conf.appUrl + conf.loginUrl} color="primary">
                <LoginIcon className={classes.button} />
                Login
              </Fab>
              <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                <CloseIcon className={classes.button} />
                Cancel
              </Fab>
              {/* <Button variant="outlined" color="primary" href={conf.appUrl + conf.loginUrl}>
                Login
              </Button>
              <Button variant="outlined" onClick={handleClose} color="default">
                Cancel
              </Button> */}
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
});

// -----------------------------------------------------------------------------

export default LoginDialog;

// -----------------------------------------------------------------------------
