// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";

import { withStyles } from "@material-ui/core/styles";

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    flex: 1
  }
});

// -----------------------------------------------------------------------------

const MatchEdit = withStyles(styles)(({ classes, children }) => {
  return <div>{children ? children : ""}</div>;
});

// -------------------------------------

MatchEdit.propTypes = {
  children: PropTypes.object.isRequired
};

// ------------------------------------

export default MatchEdit;

// -----------------------------------------------------------------------------
