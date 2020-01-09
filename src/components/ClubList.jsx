// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { fade, withStyles } from "@material-ui/core/styles";
import { Card, CardActionArea, CardMedia, CardContent, Typography, Button, Grid, Paper } from "@material-ui/core";
import { AppBar as MuiAppBar, Toolbar, SearchIcon, InputBase, IconButton } from "@material-ui/core";
import { ArrowBackIos, SportsTennis } from "@material-ui/icons";

import { useDispatch, useSelector } from "react-redux";
import conf from "../conf";

// -----------------------------------------------------------------------------

const styles = theme => {
  return {
    root: {
      flex: 1,
      paddingTop: theme.mixins.toolbar.minHeight
    },
    appBar: {
      top: "auto",
      bottom: 0
    },
    grow: {
      flexGrow: 1
    },

    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },

    content: {
      width: "100vw",
      margin: theme.spacing(0),
      padding: theme.spacing(2)
    },
    card: {
      margin: theme.spacing(0),
      padding: theme.spacing(0)
    },
    cardMedia: {
      margin: theme.spacing(2),
      padding: theme.spacing(1),
      width: "28vw",
      height: "28vw",
      borderRadius: "50%",
      background: `radial-gradient(center, ${theme.palette.primary[300]}, ${theme.palette.primary[300]})`
    },
    cardTitle: {
      textAlign: "center",
      margin: theme.spacing(-1, 2, 2, 2),
      width: "28vw"
    },
    cardText: {
      minHeight: 200
    },
    cardActions: {
      justifyContent: "flex-end"
    }
  };
};

// -----------------------------------------------------------------------------

const TopNav = withStyles(styles)(({ classes, router, info }) => {
  return (
    <MuiAppBar color="inherit" position="fixed" className={classes.topBar}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => {}}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h6" color="inherit" className={classes.flex}>
          {"TopNav"}
        </Typography>
        <div className={classes.grow} />

        <IconButton edge="end" color="inherit" onClick={() => {}}>
          <SportsTennis />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
});

// -----------------------------------------------------------------------------

const ClubCard = withStyles(styles)(({ classes, router, info }) => {
  const appUrl = conf.appUrl;

  const CardRow = ({ label, text }) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Typography variant="caption" align="right" display="block" color="textSecondary" noWrap>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="caption" align="left" display="block" color="textPrimary" noWrap>
            {text}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Card
      className={classes.card}
      onClick={() => {
        router.push(`/clubs/${info._id}`);
      }}
    >
      <CardActionArea>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <CardMedia
              component="img"
              alt={info.name}
              image={info.img ? info.img : appUrl + "/img/tennis.jpg"}
              title={`${info.name} (${info.facebook})`}
              className={classes.cardMedia}
            />
            <Typography variant="h6" component="h2" className={classes.cardTitle}>
              {`${info.name}`}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <CardContent>
              <CardRow label="Facebook" text={info.facebook} />
              <hr />
              <CardRow label="Plays" text={info.play_style} />
              <CardRow label="Forehand" text={`${info.forehand}`} />
              <CardRow label="Backhand" text={`${info.backhand}`} />
              <CardRow
                label="Win/Lost/Total"
                text={`${info.club_rating.win} / ${info.club_rating.total - info.club_rating.win} / ${info.club_rating.total}`}
              />
              <CardRow label="Win-rate" text={`${Math.round((info.club_rating.win / info.club_rating.total) * 1000) / 10}%`} />
              <CardRow label="Ranking" text={info.club_rating.rank} />
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
});

// -------------------------------------

ClubCard.propTypes = {
  router: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const ClubList = withStyles(styles)(({ classes, router }) => {
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
      <TopNav />

      <Grid container spacing={2} className={classes.content}>
        {data.clubs
          ? data.clubs.map(item => (
              <Grid item key={item._id}>
                <Paper>
                  <ClubCard router={router} info={item}></ClubCard>
                </Paper>
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
