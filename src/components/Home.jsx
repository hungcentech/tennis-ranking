// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import { Grid, Paper, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from "@material-ui/core";

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
  const appUrl = useSelector(state => state.config.appUrl);
  const items = useSelector(state => state.homeItems);

  // DEBUG
  // console.log("items:", items);

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className={classes.content}>
        {items.map(item => (
          <Grid item xs={6} key={item.url}>
            <Card
              className={classes.card}
              onClick={() => {
                router.push(`${appUrl + item.url}`);
              }}
            >
              <CardActionArea>
                <CardMedia className={classes.media} image={appUrl + item.imgUrl} title={item.title} />
                {/* <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                      ranging across all continents except Antarctica
                    </Typography>
                  </CardContent> */}
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
    </div>
  );
});

// -------------------------------------

Home.propTypes = {
  // router: PropTypes.object.isRequired
};

// ------------------------------------

export default Home;

// -----------------------------------------------------------------------------
