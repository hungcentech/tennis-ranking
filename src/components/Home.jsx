// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { Grid, Paper, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from "@material-ui/core";

import conf from "../conf";
import LoginDialog from "./Login.jsx";

// -----------------------------------------------------------------------------

const styles = theme => {
  return {
    root: {
      flex: 1
    },
    content: {
      width: "100vw",
      margin: theme.spacing(0),
      padding: theme.spacing(2)
    },
    card: {
      margin: theme.spacing(0),
      padding: theme.spacing(0),
      borderRadius: theme.spacing(2)
    },
    media: {
      margin: theme.spacing(0),
      padding: theme.spacing(0),
      height: "25vh"
      // background: `radial-gradient(center, ${theme.palette.primary[300]}, ${theme.palette.primary[300]})`
    }
  };
};

// -----------------------------------------------------------------------------

const Home = withStyles(styles)(({ classes, router }) => {
  const appUrl = conf.appUrl;
  const items = conf.homeItems;

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // DEBUG
    // console.log("query:", router.location.query);
    // console.log("user:", user);

    if (
      !user &&
      router.location.query &&
      router.location.query.id &&
      router.location.query.name &&
      router.location.query.token
    ) {
      dispatch({
        type: "user_update",
        payload: {
          id: router.location.query.id,
          token: router.location.query.token,
          avatar: decodeURIComponent(router.location.query.avatar),
          facebook: router.location.query.facebook,
          name: router.location.query.name
        }
      });

      // DEBUG
      // console.log("user_update triggered.");
    }
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className={classes.content}>
        {items.map(item => (
          <Grid item xs={6} key={item.url}>
            <Card
              className={classes.card}
              onClick={() => {
                user ? router.push(`${appUrl + item.url}`) : setLoginDialogOpen(true);
              }}
              disabled={true}
            >
              <CardActionArea>
                <CardMedia className={classes.media} image={appUrl + item.imgUrl} title={item.title} />
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  {item.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <LoginDialog open={loginDialogOpen} setOpen={setLoginDialogOpen} />
    </div>
  );
});

// -------------------------------------

Home.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default Home;

// -----------------------------------------------------------------------------
