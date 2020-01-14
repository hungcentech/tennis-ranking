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
  Fab,
  TextField
} from "@material-ui/core";
import { Cancel as CloseIcon, Save as SaveIcon } from "@material-ui/icons";

import conf from "../../conf";
import { blue } from "@material-ui/core/colors";

// -----------------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// -----------------------------------------------------------------------------

const styles = theme => ({
  avatar480dn: {
    margin: theme.spacing(2, 1, 1, 1),
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: "50%"
  },
  avatar480up: {
    margin: theme.spacing(2, 1, 1, 4),
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: "50%"
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
const EditorRow = ({ label, text, setText }) => {
  const lang = useSelector(state => state.lang);
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Typography variant="caption" align="right" display="block" color="textSecondary" noWrap>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        {/* <Typography variant="caption" align="left" display="block" color="textPrimary" noWrap>
          {text}Chien binh Nguyen Trai
        </Typography> */}
        <TextField
          // className={classes.navSearch}
          placeholder={`${conf.labels.name[lang]}...`}
          value={text}
          onChange={setText}
        />
      </Grid>
    </Grid>
  );
};

// -----------------------------------------------------------------------------

const ClubEditorDialog = withStyles(styles)(({ classes, editor, setEditor }) => {
  const lang = useSelector(state => state.lang);
  const club = editor.club;

  const handleClose = () => {
    setEditor({ open: false, club: undefined });
  };

  const handleSave = () => {
    // ... fetch...

    setEditor({ open: false, club: undefined });
  };

  const w480up = useMediaQuery("(min-width:480px)");

  return (
    <div>
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={editor.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Avatar
              src={club && club.avatar ? club.avatar : ""}
              className={w480up ? classes.avatar480up : classes.avatar480dn}
            />
          </Grid>

          <Grid item xs={9}>
            <DialogTitle>{club ? conf.labels.updateClub[lang] : conf.labels.addClub[lang]}</DialogTitle>
            <DialogContent className={classes.content}>
              <EditorRow label="Name" text={club ? club.name : ""} />
            </DialogContent>
          </Grid>

          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Grid container>
                <Grid item xs={6}>
                  <Fab variant="extended" size="medium" onClick={handleSave} color="primary">
                    <SaveIcon className={classes.button} />
                    Save
                  </Fab>
                </Grid>
                <Grid item xs={6}>
                  <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                    <CloseIcon className={classes.button} />
                    Cancel
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

// -----------------------------------------------------------------------------

export default ClubEditorDialog;

// -----------------------------------------------------------------------------
