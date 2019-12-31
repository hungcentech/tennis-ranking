// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";

import { withStyles } from "@material-ui/core/styles";

import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import RoutedAppBar from "../components/RoutedAppBar.jsx";

// -----------------------------------------------------------------------------

const appUrl = "/tennisrankings/";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flex: 1
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%"
  },
  image: {
    position: "relative",
    height: 180,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 120
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15
      },
      "& $imageMarked": {
        opacity: 0
      },
      "& $imageTitle": {
        border: "4px solid currentColor"
      }
    }
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%"
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity")
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity")
  }
});

// -----------------------------------------------------------------------------

const HomeLayout = withStyles(styles)(({ classes, router }) => {
  const menus = [
    {
      imgUrl: appUrl + "img/sport4.jpeg",
      title: "Rankings",
      url: appUrl + "rankings",
      width: "33.3333%"
    },
    {
      imgUrl: appUrl + "img/court2.jpeg",
      title: "Matches",
      url: appUrl + "matches",
      width: "33.3333%"
    },
    {
      imgUrl: appUrl + "img/sport5.jpeg",
      title: "Players",
      url: appUrl + "players",
      width: "33.3333%"
    },
    {
      imgUrl: appUrl + "/img/guests1.jpeg",
      title: "Guests",
      width: "33.3333%"
    },
    {
      imgUrl: appUrl + "/img/team2.jpeg",
      title: "Clubs",
      width: "33.3333%"
    },
    {
      imgUrl: appUrl + "/img/logout1.jpeg",
      title: "More...",
      width: "33.3333%"
    }
  ];

  return (
    <div className={classes.root}>
      <RoutedAppBar title="TGM Rankings" />
      <div className={classes.content}>
        {menus.map(item => (
          <ButtonBase
            focusRipple
            key={item.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
              width: item.width
            }}
            href={item.url}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${item.imgUrl})`
              }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
              >
                {item.title}
                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase>
        ))}
      </div>
    </div>
  );
});

// -------------------------------------

HomeLayout.propTypes = {
  router: PropTypes.object.isRequired
};

// ------------------------------------

export default HomeLayout;

// -----------------------------------------------------------------------------
