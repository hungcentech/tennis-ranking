// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { Grid, Card, CardActionArea, CardMedia, CardActions, Button } from "@material-ui/core";

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
    }
  };
};

// -----------------------------------------------------------------------------

const Home = withStyles(styles)(({ classes, router }) => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const lang = useSelector(state => state.lang);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // DEBUG
    // console.log("query:", router.location.query);

    let data = router.location.query;
    Object.keys(data).map(key => {
      data[key] = decodeURIComponent(data[key]);
    });
    // DEBUG:
    // console.log("query => data:", data);

    if (!user) {
      if (data && data.id && data.token) {
        // Get user details from API
        fetch(`${conf.urls.app}/api/players?token=${data.token}`, {
          method: "GET",
          headers: { authorization: `Bearer ${data.token}`, "content-type": "application/json" }
        })
          .then(response => {
            if (response.ok) {
              response
                .json()
                .then(apiRes => {
                  console.log("More user details:", apiRes);

                  dispatch({
                    type: "user_update",
                    payload: apiRes.records[0]
                  });
                })
                .catch(err => {
                  let error = new Error("Invalid response format. " + err);
                  console.log(error);
                });
            } else {
              let error = new Error("Invalid request");
              console.log(error, response);
            }
          })
          .catch(err => {
            let error = new Error("Fetch failed. " + err);
            console.log(error);
          });
      } else {
        // DEBUG
        console.log("Invalid user data:", data);
      }
    }
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className={classes.content}>
        {Object.values(conf.locations)
          .slice(1)
          .map(item => (
            <Grid item xs={6} key={item.url}>
              <Card
                className={classes.card}
                onClick={() => {
                  user
                    ? user.clubs && user.clubs.length > 0
                      ? router.push(`${conf.urls.app + item.url}`)
                      : router.push(`${conf.urls.app + conf.urls.clubs}`)
                    : setLoginDialogOpen(true);
                }}
                disabled={true}
              >
                <CardActionArea>
                  <CardMedia className={classes.media} image={conf.urls.app + item.img} title={item.title[lang]} />
                </CardActionArea>
                <CardActions>
                  <Button size="small" color={item.emphasized ? item.emphasized : "inherit"}>
                    {item.title[lang]}
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
