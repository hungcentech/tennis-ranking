// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
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
  Fab,
  TextField
} from "@material-ui/core";
import { Edit, Cancel, Save } from "@material-ui/icons";

import conf from "../../conf";

// -----------------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flex: 1
  },

  avatar480dn: {
    margin: theme.spacing(0, 0, 0, 2),
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: "50%"
  },
  avatar480up: {
    margin: theme.spacing(0, 0, 0, 4),
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: "50%"
  },

  content: {
    flex: 1,
    margin: theme.spacing(-4, 1, 1, 1)
  },
  input: {
    marginTop: theme.spacing(1)
  },

  actions: {
    margin: theme.spacing(2, 2)
  },
  icon: {
    marginRight: theme.spacing(1)
  }
});

// -----------------------------------------------------------------------------

const EditorField = withStyles(styles)(({ classes, label, value, onChange, disabled }) => {
  return (
    <TextField
      className={classes.input}
      label={label}
      // placeholder={`${label}...`}
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      fullWidth
      disabled={disabled}
    />
  );
});

// -----------------------------------------------------------------------------

const ClubEditor = withStyles(styles)(({ classes, _club, open, setOpen }) => {
  const w480up = useMediaQuery("(min-width:480px)");

  const lang = useSelector(state => state.lang);
  const [club, setClub] = useState(Object.assign(_club));

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (club != _club) {
      console.log("Saving...");
      setTimeout(() => {
        console.log("........ done!");
      }, 1000);
    }
    // ... fetch...

    setOpen(false);
  };

  const handleChange = (key, newValue) => {
    var newClub = { ...club };
    newClub[key] = newValue;
    console.log("handleChange(): club changed:", club, "=>", newClub);
    setClub(newClub);
  };

  return (
    <Dialog
      className={classes.root}
      maxWidth={"sm"}
      fullWidth={true}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <form>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <DialogTitle>{club._id ? conf.labels.updateClub[lang] : conf.labels.addClub[lang]}</DialogTitle>
          </Grid>

          <Grid item xs={3}>
            <Avatar src={club.avatar ? club.avatar : ""} className={w480up ? classes.avatar480up : classes.avatar480dn} />
          </Grid>

          <Grid item xs={9}>
            <DialogContent className={classes.content}>
              {["_id", "name", "description", "avatar", "address", "contacts", "status"].map(k => {
                let v = club[k];
                return (
                  <TextField
                    key={k}
                    className={classes.input}
                    label={k}
                    value={v}
                    onChange={ev => {
                      handleChange(k, ev.target.value);
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled={k == "_id" || k == "status"}
                  />
                );
              })}
            </DialogContent>
          </Grid>

          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Grid container>
                <Grid item xs={6}>
                  <Fab variant="extended" size="medium" onClick={handleSave} color="primary">
                    <Save className={classes.icon} />
                    Save
                  </Fab>
                </Grid>
                <Grid item xs={6}>
                  <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                    <Cancel className={classes.icon} />
                    Cancel
                  </Fab>
                </Grid>
              </Grid>
            </DialogActions>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
});

// -----------------------------------------------------------------------------

export default ClubEditor;

// -----------------------------------------------------------------------------
