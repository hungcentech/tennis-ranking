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
import ClubAdd from "./ClubAdd.jsx";
import ClubEdit from "./ClubEdit.jsx";

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

const getClubs = (user, search) => {
  return new Promise((resolve, reject) => {
    // DEBUG:
    // console.log("getClubs(): user =", user);
    if (!user) {
      reject(new Error("getClub(): user not set"));
    } else {
      let uri = `${conf.urls.app}/api/clubs` + (search ? "?search=" + search : "");
      // DEBUG:
      // console.log("getClubs(): uri =", uri);

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
                console.log("getClubs(): apiRes =", apiRes);
                resolve(apiRes);
              })
              .catch(err => {
                let error = new Error("Invalid response format: " + err.message);
                console.log("getClubs():" + error);
                reject(error);
              });
          } else {
            let error = new Error("Response received with error");
            console.log("getClubs():", error);
            reject(error);
          }
        })
        .catch(err => {
          let error = new Error("Cannot get clubs info: " + err.message);
          console.log("getClubs():" + error);
          reject(error);
        });
    }
  });
};

// -----------------------------------------------------------------------------

const TopNav = withStyles(styles)(({ classes, router, lang, user }) => {
  const dispatch = useDispatch();
  const search = useSelector(state => state.search.clubs);
  const [clubAddOpen, setClubAddOpen] = useState(false);

  const handleChange = ev => {
    dispatch({
      type: "search_clubs",
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
          placeholder={user && user.clubName ? user.clubName : `${conf.labels.find[lang]} ${conf.labels.club[lang]}`}
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
            setClubAddOpen(true);
          }}
        >
          <Add />
        </IconButton>
      </Toolbar>

      <ClubAdd lang={lang} user={user} open={clubAddOpen} setOpen={setClubAddOpen} />
    </MuiAppBar>
  );
});

// -------------------------------------

TopNav.propTypes = {
  router: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
};

// -----------------------------------------------------------------------------

const ClubCard = withStyles(styles)(({ classes, lang, user, club }) => {
  const w350up = useMediaQuery("(min-width:350px)");
  const w480up = useMediaQuery("(min-width:480px)");

  const [clubEditOpen, setClubEditOpen] = useState(false);
  const dispatch = useDispatch();

  const clubAddPlayer = () => {
    if (club.players && club.players.map(p => p.id == user.id).reduce((a, b) => a || b, false)) {
      // DEBUG:
      console.log("clubAddPlayer(): Club already had this player");
    } else {
      if (!club.players) club.players = [];

      // DEBUG:
      console.log("clubAddPlayer(): players:", club.players);

      // Update DB:
      let changes = { players: club.players };
      changes.players.push({ id: user.id, facebook: user.facebook });
      let apiReq = {
        id: club.id,
        data: changes
      };
      fetch(`${conf.urls.app}/api/clubs`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${user.token}`, "content-type": "application/json" },
        body: JSON.stringify(apiReq)
      })
        .then(response => {
          if (response.ok) {
            response
              .json()
              .then(apiRes => {
                console.log("clubAddPlayer(): Success.", apiRes);

                // Refresh club list
                dispatch({
                  type: "search_clubs",
                  payload: undefined
                });
                setTimeout(() => {
                  dispatch({
                    type: "search_clubs",
                    payload: ""
                  });
                }, 100);
              })
              .catch(err => {
                let error = new Error("Invalid response format. " + err);
                console.log("clubAddPlayer():", error);
              });
          } else {
            let error = new Error("Invalid request");
            console.log("clubAddPlayer():", error, response);
          }
        })
        .catch(err => {
          let error = new Error("Fetch failed. " + err);
          console.log("clubAddPlayer():", error);
        });
    }
  };

  const playerAddClub = () => {
    if (user.clubs && user.clubs.map(c => c.id == club.id).reduce((a, b) => a || b, false)) {
      // DEBUG:
      console.log("playerAddClub(): Player already in this club");
    } else {
      if (!user.clubs) user.clubs = [];

      // DEBUG:
      console.log("playerAddClub(): clubs:", user.clubs);

      // Update DB:
      let changes = { clubs: user.clubs };
      changes.clubs.push({ id: club.id, name: club.name });
      let apiReq = {
        id: user.id,
        data: changes
      };
      fetch(`${conf.urls.app}/api/players`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${user.token}`, "content-type": "application/json" },
        body: JSON.stringify(apiReq)
      })
        .then(response => {
          if (response.ok) {
            response
              .json()
              .then(apiRes => {
                console.log("playerAddClub(): Success.", apiRes);

                // Refresh club list
                dispatch({
                  type: "search_clubs",
                  payload: undefined
                });
                setTimeout(() => {
                  dispatch({
                    type: "search_clubs",
                    payload: ""
                  });
                }, 100);
              })
              .catch(err => {
                let error = new Error("Invalid response format. " + err);
                console.log("playerAddClub():", error);
              });
          } else {
            let error = new Error("Invalid request");
            console.log("playerAddClub():", error, response);
          }
        })
        .catch(err => {
          let error = new Error("Fetch failed. " + err);
          console.log("playerAddClub():", error);
        });
    }
  };

  const handleJoinClub = () => {
    clubAddPlayer();
    playerAddClub();
  };

  return (
    <Card>
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <CardMedia
            className={w480up ? classes.avatar480up : classes.avatar480dn}
            image={club.avatar ? club.avatar : conf.urls.app + "/img/tennis.jpg"}
            title=""
          />
        </Grid>

        <Grid item xs={8}>
          <CardContent>
            <Typography variant="h6" color="inherit">
              {club.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {/* {`${conf.labels.address[lang]}: ${club.address}`} */}
              {`${club.address}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {club.notes}
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
                  setClubEditOpen(true);
                }}
                disabled={!(club.admins ? club.admins.map(adm => adm.id == user.id).reduce((a, b) => a || b, false) : false)}
              >
                <EditIcon />
              </Fab>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
              <Fab
                variant="extended"
                size={w480up ? "medium" : "small"}
                onClick={handleJoinClub}
                color="secondary"
                disabled={
                  club.players &&
                  club.players.map(p => p.id == user.id).reduce((a, b) => a || b, false) &&
                  user.clubs &&
                  user.clubs.map(c => c.id == club.id).reduce((a, b) => a || b, false)
                }
              >
                {w350up ? <JoinIcon className={classes.fabIcon} /> : ""}
                {`${conf.labels.join[lang]} ${conf.labels.club[lang]}`}
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ClubEdit lang={lang} user={user} theClub={club} open={clubEditOpen} setOpen={setClubEditOpen} />
    </Card>
  );
});

// -------------------------------------

ClubCard.propTypes = {
  router: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  club: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const ClubList = withStyles(styles)(({ classes, router }) => {
  const [data, setData] = useState({ records: [] });

  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const search = useSelector(state => state.search.clubs);

  const refreshClubList = () => {
    console.log("refreshClubList(): Getting club list...");
    getClubs(user, search)
      .then(apiRes => {
        // console.log(`refreshClubList(): Latest club list:`, apiRes);
        setData(apiRes);
      })
      .catch(err => {
        console.log("refreshClubList(): Failed to get clubs:", err.message);
      });
  };

  useEffect(() => {
    if (!user) {
      // router.push(conf.urls.app);
      router.goBack();
    } else {
      refreshClubList();
    }
  }, [search]);

  return (
    <div className={classes.root}>
      <TopNav router={router} lang={lang} user={user} />

      <Grid container spacing={2} className={classes.content}>
        {data.records
          ? data.records.map(club => (
              <Grid xs={12} item key={club.id}>
                <ClubCard xs={12} router={router} lang={lang} user={user} club={club}></ClubCard>
              </Grid>
            ))
          : ""}
      </Grid>
    </div>
  );
});

// -------------------------------------

ClubList.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default ClubList;

// -----------------------------------------------------------------------------
