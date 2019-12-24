// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";

import { withStyles } from "@material-ui/core/styles";

import TennisRankingsAppBar from "./TennisRankingsAppBar.jsx";
import TennisRankingsBottomNav from "./TennisRankingsBottomNav.jsx";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

// -----------------------------------------------------------------------------

const TennisRankingsApp = withStyles(styles)(({ classes, children }) => {
  return (
    <div>
      <TennisRankingsAppBar />
      <div>{children}</div>
      <TennisRankingsBottomNav />
    </div>
  );
});

// -------------------------------------

TennisRankingsApp.propTypes = {
  children: PropTypes.object.isRequired
};

// ------------------------------------

export default TennisRankingsApp;

// -----------------------------------------------------------------------------
