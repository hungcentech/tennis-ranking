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
  avatar480dn: {
    margin: theme.spacing(4, 2, 2),
    width: theme.spacing(12),
    height: theme.spacing(12),
    background: `radial-gradient(center, ${theme.palette.grey[100]}, ${theme.palette.grey[900]})`
  },
  name480dn: {
    margin: theme.spacing(0, 2),
    width: theme.spacing(12),
    textAlign: "center"
  },
  avatar480up: {
    margin: theme.spacing(4, 4, 2),
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  name480up: {
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
  const lang = useSelector(state => state.lang);
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

  const w350up = useMediaQuery("(min-width:350px)");
  const w480up = useMediaQuery("(min-width:480px)");

  return (
    <div>
      <Dialog maxWidth={"xs"} fullWidth={false} open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Avatar
              alt={user && user.name ? user.name : ""}
              src={user && user.avatar ? user.avatar : ""}
              className={w480up ? classes.avatar480up : classes.avatar480dn}
            />
            <Typography className={w480up ? classes.name480up : classes.name480dn}>
              {user && user.name ? `${user.name}` : ""}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <DialogTitle className={classes.title}>{"Login"}</DialogTitle>
            <DialogContent className={classes.content}>
              <DialogContentText>Please login to continue...</DialogContentText>
            </DialogContent>
          </Grid>
          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Grid container justify="center">
                <Grid item xs={w480up ? 2 : 1}></Grid>
                <Grid item xs={w480up ? 4 : 5}>
                  <Fab variant="extended" size="medium" href={conf.urls.app + conf.urls.login} color="primary">
                    {w350up ? <LoginIcon className={classes.button} /> : ""}
                    Login
                  </Fab>
                </Grid>
                <Grid item xs={w480up ? 4 : 5}>
                  <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                    {w350up ? <CloseIcon className={classes.button} /> : ""}
                    Cancel
                  </Fab>
                </Grid>
                <Grid item xs={w480up ? 2 : 1}></Grid>
              </Grid>
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
