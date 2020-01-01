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

const MatchList = withStyles(styles)(({ classes, children }) => {
  return (
    <div>
      <div>{children ? children : ""}</div>
    </div>
  );
});

// -------------------------------------

MatchList.propTypes = {
  // children: PropTypes.object.isRequired
};

// ------------------------------------

export default MatchList;

// -----------------------------------------------------------------------------
