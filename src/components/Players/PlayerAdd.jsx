// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, Avatar, Grid, Fab, TextField } from "@material-ui/core";
import { Cancel as CloseIcon, Save as SaveIcon } from "@material-ui/icons";

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
  button: {
    marginRight: theme.spacing(1)
  }
});

// -----------------------------------------------------------------------------

const PlayerAdd = withStyles(styles)(({ classes, lang, user, open, setOpen }) => {
  const w350up = useMediaQuery("(min-width:350px)");
  const w480up = useMediaQuery("(min-width:480px)");

  const [player, setPlayer] = useState({});

  const dispatch = useDispatch();

  // -------------------------------------

  const handleClose = () => {
    setOpen(false);
  };

  // -------------------------------------

  const handleSave = () => {
    if (player.name && player.name.trim() && player.address && player.address.trim()) {
      let apiReq = {
        data: { ...player, status: "active" }
      };
      // DEBUG
      console.log("handleSave(): apiReq =", apiReq);

      fetch(`${conf.urls.app}/api/players`, {
        method: "POST",
        headers: { authorization: `Bearer ${user.token}`, "content-type": "application/json" },
        body: JSON.stringify(apiReq)
      })
        .then(response => {
          if (response.ok) {
            response
              .json()
              .then(apiRes => {
                console.log("handleSave(): Successfully saved.", apiRes);

                // Refresh player list
                dispatch({
                  type: "search_players",
                  payload: undefined
                });
                setTimeout(() => {
                  dispatch({
                    type: "search_players",
                    payload: ""
                  });
                }, 100);

                setOpen(false);
              })
              .catch(err => {
                let error = new Error("Invalid response format. " + err);
                console.log("handleSave():", error);
              });

            setOpen(false);
          } else {
            let error = new Error("Invalid request");
            console.log("handleSave():", error, response);
          }
        })
        .catch(err => {
          let error = new Error("Fetch failed. " + err);
          console.log("handleSave():", error);
        });
    }
  };

  // -------------------------------------

  const handleChange = (ev, k) => {
    var _player = { ...player };
    _player[k] = ev.target.value;
    setPlayer(_player);
  };

  // -------------------------------------

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
            <DialogTitle>{`${conf.labels.add[lang]} ${conf.labels.player[lang]}`}</DialogTitle>
          </Grid>

          <Grid item xs={3}>
            <Avatar src={player.avatar ? player.avatar : ""} className={w480up ? classes.avatar480up : classes.avatar480dn} />
          </Grid>

          <Grid item xs={9}>
            <DialogContent className={classes.content}>
              {/* ["id", "status", "name", "address", "players", "admins", "notes", "avatar", "changes"] */}
              {["name", "address", "notes", "avatar"].map(k => {
                let v = player[k];
                return (
                  <TextField
                    key={k}
                    className={classes.input}
                    label={k}
                    value={v}
                    onChange={ev => {
                      handleChange(ev, k);
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled={k == "id" || k == "status"}
                  />
                );
              })}
            </DialogContent>
          </Grid>

          <Grid item xs={12}>
            <DialogActions className={classes.actions}>
              <Grid container justify="center">
                {w480up ? <Grid item xs={3}></Grid> : ""}
                <Grid item xs={w480up ? 3 : 6}>
                  <Fab
                    variant="extended"
                    size="medium"
                    onClick={handleSave}
                    color="primary"
                    disabled={!player.name || !player.name.trim() || !player.address || !player.address.trim()}
                  >
                    {w350up ? <SaveIcon className={classes.button} /> : ""}
                    {conf.labels["save"][lang]}
                  </Fab>
                </Grid>
                {w480up ? <Grid item xs={1}></Grid> : ""}
                <Grid item xs={w480up ? 3 : 6}>
                  <Fab variant="extended" size="medium" onClick={handleClose} color="default">
                    {w350up ? <CloseIcon className={classes.button} /> : ""}
                    {conf.labels["cancel"][lang]}
                  </Fab>
                </Grid>
                {w480up ? <Grid item xs={2}></Grid> : ""}
              </Grid>
            </DialogActions>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
});

// -----------------------------------------------------------------------------

export default PlayerAdd;

// -----------------------------------------------------------------------------
