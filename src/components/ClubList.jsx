// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, CardMedia, Typography, Fab } from "@material-ui/core";
import { AppBar as MuiAppBar, Toolbar, IconButton } from "@material-ui/core";
import { ArrowBackIos, Search, Add, SportsTennis as JoinIcon } from "@material-ui/icons";

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

const ClubCard = withStyles(styles)(({ classes, router, user, club }) => {
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.avatar} image={club.img ? club.img : conf.appUrl + "/img/tennis.jpg"} title="" />
      <div className={classes.cardDetails}>
        <CardContent className={classes.cardContent}>
          <Typography component="h5" variant="h5">
            {`${club.name}`}
          </Typography>
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
            <JoinIcon className={classes.button} />
            {"Join club"}
          </Fab>
        </div>
      </div>
    </Card>
  );
});

// -------------------------------------

ClubCard.propTypes = {
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  club: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const TopNav = withStyles(styles)(({ classes, router, user }) => {
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
        <Typography variant="button" color="textSecondary">
          {user && user.clubName ? user.clubName : "Find your club..."}
        </Typography>
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
  user: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const ClubList = withStyles(styles)(({ classes, router }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState({ clubs: [] });

  useEffect(() => {
    let uri = conf.appUrl + "/api/players";
    fetch(uri)
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(data => {
              data.records.forEach(club => {
                club.created = new Date(club.created);
                if (club.completionDate) club.completionDate = new Date(club.completionDate);
              });
              setData({ clubs: data.records });
            })
            .catch(err => {
              console.log("Server connection error: " + err.message);
            });
        } else {
          response
            .json()
            .then(err => {
              console.log("Failed to fetch clubs: " + err.message);
            })
            .catch(err => {
              console.log("Server connection error: " + err.message);
            });
        }
      })
      .catch(err => {
        console.log("Error in fetching data from server:", err.message);
      });
  }, []);

  return (
    <div className={classes.root}>
      <TopNav router={router} user={user} />

      <Grid container spacing={2} className={classes.content}>
        {data.clubs
          ? data.clubs.map(item => (
              <Grid xs={12} item key={item._id}>
                <ClubCard router={router} user={user} club={item}></ClubCard>
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
