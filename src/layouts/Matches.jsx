// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";

import { withStyles } from "@material-ui/core/styles";

import RoutedAppBar from "../components/RoutedAppBar.jsx";

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

const MatchesLayout = withStyles(styles)(({ classes, children }) => {
  return (
    <div>
      <RoutedAppBar />
      <div>{children}</div>
    </div>
  );
});

// -------------------------------------

MatchesLayout.propTypes = {
  children: PropTypes.object.isRequired
};

// ------------------------------------

export default MatchesLayout;

// -----------------------------------------------------------------------------
