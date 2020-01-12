// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Grid, Card, CardContent, CardMedia, Typography, Fab } from "@material-ui/core";
import { AppBar as MuiAppBar, Toolbar, IconButton, TextField, InputAdornment } from "@material-ui/core";
import { ArrowBackIos, Search, Flag, Add, SportsTennis as JoinIcon } from "@material-ui/icons";

import conf from "../conf";

// -----------------------------------------------------------------------------

const styles = theme => {
  return {
    root: {
      flex: 1,
      paddingTop: theme.mixins.toolbar.minHeight
    },
    grow: {
      flex: 1
    },
    content: {
      maxWidth: "100vw",
      margin: theme.spacing(0),
      padding: theme.spacing(1)
    },

    card: {
      display: "flex"
    },
    cardDetails: {
      display: "flex",
      flexDirection: "column"
    },
    cardContent: {
      flex: "1 0 auto"
    },
    avatar: {
      margin: theme.spacing(2, 2, 2, 4),
      width: theme.spacing(16),
      height: theme.spacing(16),
      borderRadius: "50%"
    },
    button: {
      marginRight: theme.spacing(1)
    },
    controls: {
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(3)
    }
  };
};

// -----------------------------------------------------------------------------

const TopNav = withStyles(styles)(({ classes, router, lang, user }) => {
  const dispatch = useDispatch();

  return (
    <MuiAppBar color="inherit" position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => {
            router.goBack();
          }}
        >
          <ArrowBackIos />
        </IconButton>

        <TextField
          className={classes.margin}
          placeholder={user && user.clubName ? user.clubName : conf.labels.findClub[lang]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Flag />
              </InputAdornment>
            )
          }}
        />

        <div className={classes.grow} />
        <IconButton edge="end" color="inherit" onClick={() => {}}>
          <Search />
        </IconButton>
        <IconButton edge="end" color="inherit" onClick={() => {}}>
          <Add />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
});

// -------------------------------------

TopNav.propTypes = {
  router: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const ClubCard = withStyles(styles)(({ classes, router, lang, user, club }) => {
  const w400dn = useMediaQuery("(min-width:350px)");
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.avatar} image={club.img ? club.img : conf.urls.app + "/img/tennis.jpg"} title="" />
      <div className={classes.cardDetails}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h6">{`${club.name}`}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {club.president ? club.president : "everyone"}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <Fab
            variant="extended"
            size="small"
            onClick={() => {}}
            color="secondary"
            className={classes.fab}
            disabled={user && user.clubName ? true : false}
          >
            {w400dn ? <JoinIcon className={classes.button} /> : ""}
            {conf.labels.joinClub[lang]}
          </Fab>
        </div>
      </div>
    </Card>
  );
});

// -------------------------------------

ClubCard.propTypes = {
  router: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  club: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const ClubList = withStyles(styles)(({ classes, router }) => {
  const [data, setData] = useState({ records: [] });

  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      router.push(conf.urls.app);
    } else {
      let uri = `${conf.urls.app}/api/clubs?uid=${user.uid}`;
      fetch(uri, {
        method: "GET",
        headers: new Headers({ authorization: `Bearer ${user.token}` })
      })
        .then(response => {
          if (response.ok) {
            response
              .json()
              .then(apiRes => {
                setData(apiRes);
              })
              .catch(err => {
                console.log("Server connection error: " + err.message);
              });
          } else {
            response
              .json()
              .then(err => {
                console.log("Failed to fetch data: " + err.message);
              })
              .catch(err => {
                console.log("Server connection error: " + err.message);
              });
          }
        })
        .catch(err => {
          console.log("Error in fetching data from server:", err.message);
        });
    }
  }, []);

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
