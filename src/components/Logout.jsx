// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
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
import { Close, OpenInNew } from "@material-ui/icons";

import conf from "../conf";

// -----------------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// -----------------------------------------------------------------------------

const styles = theme => ({
  avatar_xs: {
    margin: theme.spacing(4, 2, 1),
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  name_xs: {
    margin: theme.spacing(0, 2),
    width: theme.spacing(12)
  },
  avatar_sm: {
    margin: theme.spacing(4, 4, 2),
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  name_sm: {
    margin: theme.spacing(0, 4),
    width: theme.spacing(12)
  },
  title: {
    margin: theme.spacing(2, 2)
    // color: theme.palette.error.main
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

const LogoutDialog = withStyles(styles)(({ classes, router, open, setOpen }) => {
  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch({
      type: "user_update",
      payload: undefined
    });

    setOpen(false);

    router.push(conf.urls.app);
  };

  const w400dn = useMediaQuery("(max-width:400px)");

  return (
    <div>
      <Dialog maxWidth={"xs"} fullWidth={false} open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Avatar
              alt={user && user.name ? user.name : ""}
              src={user && user.avatar ? user.avatar : ""}
              className={w400dn ? classes.avatar_xs : classes.avatar_sm}
            />
            <Typography
              variant="subtitle2"
              display="block"
              align="center"
              // noWrap="true"
              className={w400dn ? classes.name_xs : classes.name_sm}
            >
              {user && user.name ? user.name : ""}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              align="center"
              noWrap={true}
              className={w400dn ? classes.name_xs : classes.name_sm}
            >
              ({user && user.clubName ? user.clubName : conf.labels.noClub[lang]})
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <DialogTitle className={classes.title}>{"Logout"}</DialogTitle>
            <DialogContent className={classes.content}>
              <DialogContentText>Are you sure you want to logout?</DialogContentText>
            </DialogContent>
          </Grid>
          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Grid container>
                <Grid item xs={6}>
                  <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                    <Close className={classes.button} />
                    Cancel
                  </Fab>
                </Grid>
                <Grid item xs={6}>
                  <Fab variant="extended" size="medium" onClick={handleLogout} color="secondary">
                    <OpenInNew className={classes.button} />
                    Logout
                  </Fab>
                </Grid>
              </Grid>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
});

// -------------------------------------

LogoutDialog.propTypes = {
  router: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

export default LogoutDialog;

// -----------------------------------------------------------------------------
