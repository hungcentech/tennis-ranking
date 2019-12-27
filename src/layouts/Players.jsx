// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { blue, pink } from "@material-ui/core/colors";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Paper, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import RoutedAppBar from "../components/RoutedAppBar.jsx";

// -----------------------------------------------------------------------------

const styles = theme => {
  // console.log(theme);
  return {
    root: {
      flex: 1
    },
    content: {
      maxWidth: "100vw",
      margin: theme.spacing(0)
    },
    card: {
      // backgroundImage: "url('/img/sport5.jpeg')"
    },
    cardMedia: {
      margin: theme.spacing(2, 1),
      padding: theme.spacing(1),
      width: "32vw",
      height: "32vw",
      borderRadius: "50%",
      background: `radial-gradient(center, ${theme.palette.primary[300]}, ${theme.palette.primary[300]})`
    },
    cardTitle: {
      textAlign: "center",
      margin: theme.spacing(1),
      width: "33.333vw"
    },
    cardText: {
      // maxHeight: 100
    },
    cardActions: {
      // justifyContent: "flex-end"
    }
  };
};

// -----------------------------------------------------------------------------

const PlayerCard = withStyles(styles)(({ classes, router, info }) => {
  return (
    <Card
      className={classes.card}
      onClick={() => {
        router.push(`/players/${info._id}`);
      }}
    >
      <CardActionArea>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <CardMedia
              component="img"
              alt={info.name}
              image={info.img ? info.img : "/img/nadal.jpeg"}
              title={`${info.name} (${info.facebook})`}
              className={classes.cardMedia}
            />
            <Paper elevation={0}>
              <Typography gutterBottom variant="h6" component="h2" className={classes.cardTitle}>
                {`${info.name}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={classes.cardText}
              >
                {info.facebook} is a talented {info.ntrp_rating}-NTRP tennis player. His{" "}
                {info.backhand} backhand is highly efficient when returning serves. He wins many
                winners from all over the court with his magical {info.forehand}-handed forehand.
                His current standing on club rankings is number{" "}
                {info.club_rating ? info.club_rating.rank : "unknown"}.
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
      {/* <CardActions className={classes.cardActions}>
        <Button size="small" color="secondary" href="/players">
          More
        </Button>
      </CardActions> */}
    </Card>
  );
});

// -------------------------------------

PlayerCard.propTypes = {
  // router: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const PlayersLayout = withStyles(styles)(({ classes, router }) => {
  const [data, setPlayers] = useState({ players: [] });

  useEffect(() => {
    let uri = `/api/players`;
    fetch(uri)
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(data => {
              data.records.forEach(player => {
                player.created = new Date(player.created);
                if (player.completionDate) player.completionDate = new Date(player.completionDate);
              });
              setPlayers({ players: data.records });
            })
            .catch(err => {
              console.log("Server connection error: " + err.message);
            });
        } else {
          response
            .json()
            .then(err => {
              console.log("Failed to fetch players: " + err.message);
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
      <RoutedAppBar title="Players" />
      <Grid container spacing={2} className={classes.content}>
        {data.players
          ? data.players.map(item => (
              <Grid item key={item._id}>
                <Paper>
                  <PlayerCard router={router} info={item}></PlayerCard>
                </Paper>
              </Grid>
            ))
          : ""}
      </Grid>
    </div>
  );
});

// -------------------------------------

PlayersLayout.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default PlayersLayout;

// -----------------------------------------------------------------------------
