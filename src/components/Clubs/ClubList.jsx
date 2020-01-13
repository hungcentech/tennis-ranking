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

    card: {},

    cardDetails: {},
    avatar450dn: {
      margin: theme.spacing(1),
      width: theme.spacing(12),
      height: theme.spacing(12),
      borderRadius: "50%"
    },
    avatar450up: {
      margin: theme.spacing(1, 4),
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

    fab450dn: {
      marginLeft: theme.spacing(3.5)
    },
    fab450up: {
      marginLeft: theme.spacing(7.5)
    }
  };
};

// -----------------------------------------------------------------------------

const fetchClubs = (uid, token, search) => {
  return new Promise((resolve, reject) => {
    let uri = `${conf.urls.app}/api/clubs?uid=${uid}` + (search ? "&search=" + search : "");

    // DEBUG:
    console.log("fetchClubs(): uri =", uri);

    fetch(uri, {
      method: "GET",
      headers: new Headers({ authorization: `Bearer ${token}` })
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(apiRes => {
              resolve(apiRes);
            })
            .catch(err => {
              reject(Error("Invalid data format: " + err.message));
            });
        } else {
          reject(Error("Invalid request params"));
        }
      })
      .catch(err => {
        reject("Data fetch error:", err.message);
      });
  });
};

// -----------------------------------------------------------------------------

const TopNav = withStyles(styles)(({ classes, router, lang, user }) => {
  const dispatch = useDispatch();
  const [lastSearch, setLastSearch] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = ev => {
    setLastSearch(search);
    setSearch(ev.target.value);
  };

  useEffect(() => {
    if (search !== lastSearch) {
      // DEBUG:
      console.log(`search = ${search}`);

      dispatch({
        type: "search_clubs",
        payload: search
      });
    }
  });

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
          placeholder={user && user.clubName ? user.clubName : conf.labels.findClub[lang]}
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

        <IconButton className={classes.nav} edge="end" color="inherit" onClick={() => {}} disabled>
          <Add />
        </IconButton>
      </Toolbar>
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
  const w450up = useMediaQuery("(min-width:450px)");
  return (
    <Card className={classes.card}>
      <Grid container spacing={0}>
        {/* <Grid item xs={1}></Grid> */}
        <Grid item xs={4}>
          <CardMedia
            className={w450up ? classes.avatar450up : classes.avatar450dn}
            image={club.img ? club.img : conf.urls.app + "/img/tennis.jpg"}
            title=""
          />
        </Grid>
        <Grid item xs={8}>
          <CardContent>
            <Typography variant="h6" color="inherit">
              {club.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {club.address}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item xs={12} className={classes.cardControls}>
          <Grid container>
            <Grid item xs={4}>
              <Fab
                variant="extended"
                size={w450up ? "medium" : "small"}
                className={w450up ? classes.fab450up : classes.fab450dn}
                color="secondary"
                onClick={() => {}}
                disabled={true}
              >
                <EditIcon />
              </Fab>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
              <Fab
                variant="extended"
                size={w450up ? "medium" : "small"}
                onClick={() => {}}
                color="secondary"
                disabled={user && user.clubs && club.id in user.clubs}
              >
                {w350up ? <JoinIcon className={classes.fabIcon} /> : ""}
                {conf.labels.joinClub[lang]}
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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

  useEffect(() => {
    if (!user) {
      // router.push(conf.urls.app);
    } else {
      fetchClubs(user.uid, user.token, search)
        .then(clubs => setData(clubs))
        .catch(err => {
          console.log("Failed to fetch clubs: " + err.message);
        });
    }
  }, [search]);

  return (
    <div className={classes.root}>
      <TopNav router={router} lang={lang} user={user} />

      <Grid container spacing={2} className={classes.content}>
        {data.records
          ? data.records.map(club => (
              <Grid xs={12} item key={club._id}>
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
