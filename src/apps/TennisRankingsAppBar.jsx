// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { useTheme } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, Tabs } from "@material-ui/core";

// import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";

// -----------------------------------------------------------------------------

// const Header = () => (
//   <Navbar fluid>
//     <Navbar.Header>
//       <Navbar.Brand>Tennis Rankings</Navbar.Brand>
//     </Navbar.Header>
//     <Nav>
//       <LinkContainer to="/matches">
//         <NavItem>Matches</NavItem>
//       </LinkContainer>
//       <LinkContainer to="/players">
//         <NavItem>Players</NavItem>
//       </LinkContainer>
//     </Nav>
//     <Nav pullRight>
//       <MatchAddNavItem />
//       <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal" />} noCaret>
//         <MenuItem>Logout</MenuItem>
//       </NavDropdown>
//     </Nav>
//   </Navbar>
// );

// -----------------------------------------------------------------------------

export default function TennisRankingsAppBar(props) {
  const theme = useTheme();

  return (
    <AppBar position="fixed" color="inherit">
      Tennis Rankings
    </AppBar>
  );
}

// ------------------------------------

TennisRankingsAppBar.propTypes = {
  // classes: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------
