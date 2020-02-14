// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AppBar as MuiAppBar, Toolbar, TextField, InputAdornment } from "@material-ui/core";
import { Grid, Card, CardContent, CardMedia, Typography, Fab, IconButton, Button } from "@material-ui/core";
import { ArrowBackIos, Search, Add, Edit as EditIcon, SportsTennis as JoinIcon } from "@material-ui/icons";

import conf from "../../conf";
import PlayerAdd from "./PlayerAdd.jsx";
import PlayerEdit from "./PlayerEdit.jsx";

// -----------------------------------------------------------------------------

const styles = theme => {
  return {
    root: {
      paddingTop: theme.mixins.toolbar.minHeight,
      flex: 1
    },
    navSearch: {
      flex: 3
    },
    navGrow: {
      flex: 1
    },
    content: {
      maxWidth: "100vw",
      margin: theme.spacing(0),
      padding: theme.spacing(1)
    },

    avatar480dn: {
      margin: theme.spacing(2, 1, 1, 1),
      width: theme.spacing(12),
      height: theme.spacing(12),
      borderRadius: "50%"
    },
    avatar480up: {
      margin: theme.spacing(2, 1, 1, 4),
      width: theme.spacing(16),
      height: theme.spacing(16),
      borderRadius: "50%"
    },

    cardControls: {
      padding: theme.spacing(1),
      paddingBottom: theme.spacing(3)
    },
    fabIcon: {
      marginRight: theme.spacing(1)
    },

    fab480dn: {
      marginLeft: theme.spacing(3.5)
    },
    fab480up: {
      marginLeft: theme.spacing(7.5)
    }
  };
};

// -----------------------------------------------------------------------------

const getPlayers = (user, search) => {
  return new Promise((resolve, reject) => {
    // DEBUG:
    // console.log("getPlayers(): user =", user);
    if (!user) {
      reject(new Error("getPlayer(): user not set"));
    } else {
      let uri = `${conf.urls.app}/api/players` + (search ? "?search=" + search : "");
      // DEBUG:
      // console.log("getPlayers(): uri =", uri);

      fetch(uri, {
        method: "GET",
        headers: new Headers({ authorization: `Bearer ${user.token}` })
      })
        .then(response => {
          if (response.ok) {
            response
              .json()
              .then(apiRes => {
                //DEBUG:
                console.log("getPlayers(): apiRes =", apiRes);
                resolve(apiRes);
              })
              .catch(err => {
                let error = new Error("Invalid response format: " + err.message);
                console.log("getPlayers():" + error);
                reject(error);
              });
          } else {
            let error = new Error("Response received with error");
            console.log("getPlayers():", error);
            reject(error);
          }
        })
        .catch(err => {
          let error = new Error("Cannot get players info: " + err.message);
          console.log("getPlayers():" + error);
          reject(error);
        });
    }
  });
};

// -----------------------------------------------------------------------------

const TopNav = withStyles(styles)(({ classes, router, lang, user }) => {
  const dispatch = useDispatch();
  const search = useSelector(state => state.search.players);
  const [playerAddOpen, setPlayerAddOpen] = useState(false);

  const handleChange = ev => {
    dispatch({
      type: "search_players",
      payload: ev.target.value
    });
  };

  return (
    <MuiAppBar color="inherit" position="fixed">
      <Toolbar>
        <IconButton
          className={classes.nav}
          edge="start"
          color="inherit"
          onClick={() => {
            router.goBack();
          }}
        >
          <ArrowBackIos />
        </IconButton>

        <div className={classes.navGrow} />

        <TextField
          className={classes.navSearch}
          placeholder={user && user.playerName ? user.playerName : `${conf.labels.find[lang]} ${conf.labels.player[lang]}`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            )
          }}
          value={search}
          onChange={handleChange}
        />

        <IconButton
          className={classes.nav}
          edge="end"
          color="inherit"
          onClick={() => {
            setPlayerAddOpen(true);
          }}
        >
          <Add />
        </IconButton>
      </Toolbar>

      <PlayerAdd lang={lang} user={user} open={playerAddOpen} setOpen={setPlayerAddOpen} />
    </MuiAppBar>
  );
});

// -------------------------------------

TopNav.propTypes = {
  router: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
};

// -----------------------------------------------------------------------------

const PlayerCard = withStyles(styles)(({ classes, lang, user, player }) => {
  const w350up = useMediaQuery("(min-width:350px)");
  const w480up = useMediaQuery("(min-width:480px)");

  const [playerEditOpen, setPlayerEditOpen] = useState(false);
  const dispatch = useDispatch();

  const handleJoinPlayer = () => {};

  return (
    <Card>
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <CardMedia
            className={w480up ? classes.avatar480up : classes.avatar480dn}
            image={player.avatar ? player.avatar : conf.urls.app + "/img/tennis.jpg"}
            title=""
          />
        </Grid>

        <Grid item xs={8}>
          <CardContent>
            <Typography variant="h6" color="inherit">
              {player.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {/* {`${conf.labels.address[lang]}: ${player.address}`} */}
              {`${player.address}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {player.notes}
            </Typography>
          </CardContent>
        </Grid>

        <Grid item xs={12} className={classes.cardControls}>
          <Grid container>
            <Grid item xs={4}>
              <Fab
                variant="extended"
                size={w480up ? "medium" : "small"}
                className={w480up ? classes.fab480up : classes.fab480dn}
                color="secondary"
                onClick={() => {
                  setPlayerEditOpen(true);
                }}
                disabled={
                  !(player.admins ? player.admins.map(adm => adm.id == user.id).reduce((a, b) => a || b, false) : false)
                }
              >
                <EditIcon />
              </Fab>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
              <Fab
                variant="extended"
                size={w480up ? "medium" : "small"}
                onClick={handleJoinPlayer}
                color="secondary"
                disabled={true}
              >
                {w350up ? <JoinIcon className={classes.fabIcon} /> : ""}
                {`${conf.labels.join[lang]} ${conf.labels.player[lang]}`}
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <PlayerEdit lang={lang} user={user} thePlayer={player} open={playerEditOpen} setOpen={setPlayerEditOpen} />
    </Card>
  );
});

// -------------------------------------

PlayerCard.propTypes = {
  router: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const PlayerList = withStyles(styles)(({ classes, router }) => {
  const [data, setData] = useState({ records: [] });

  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const search = useSelector(state => state.search.players);

  const refreshPlayerList = () => {
    // DEBUG:
    // console.log(`refreshPlayerList(): user = ${JSON.stringify(user)}`);

    getPlayers(user, search)
      .then(apiRes => {
        // console.log(`refreshPlayerList(): Latest player list:`, apiRes);

        setData(apiRes);
      })
      .catch(err => {
        console.log("refreshPlayerList(): Failed to get players:", err.message);
      });
  };

  useEffect(() => {
    if (!user) {
      // router.push(conf.urls.app);
      router.goBack();
    } else {
      refreshPlayerList();
    }
  }, [search]);

  return (
    <div className={classes.root}>
      <TopNav router={router} lang={lang} user={user} />

      <Grid container spacing={2} className={classes.content}>
        {data.records
          ? data.records.map(player => (
              <Grid xs={12} item key={player.id}>
                <PlayerCard xs={12} router={router} lang={lang} user={user} player={player}></PlayerCard>
              </Grid>
            ))
          : ""}
      </Grid>
    </div>
  );
});

// -------------------------------------

PlayerList.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default PlayerList;

// -----------------------------------------------------------------------------
