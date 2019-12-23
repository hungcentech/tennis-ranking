// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";

import { useTheme } from "@material-ui/core/styles";

import TennisRankingsAppBar from "./TennisRankingsAppBar.jsx";
import TennisRankingsBottomNav from "./TennisRankingsBottomNav.jsx";

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

// const TennisRankingsApp = props => (
//   <div>
//     {/* <Header /> */}
//     <div className="container-fluid">
//       {props.children}
//       <hr />
//       <h5>
//         <small>{/* Tennis Rankings @ <a href="https://">CLB Tennis Gió Mùa</a>. */}</small>
//       </h5>
//     </div>
//   </div>
// );

// -----------------------------------------------------------------------------

export default function TennisRankingsApp(props) {
  const theme = useTheme();

  return (
    <div>
      <TennisRankingsAppBar />
      <div>{props.children}</div>
      <TennisRankingsBottomNav />
    </div>
  );
}

// -------------------------------------

TennisRankingsApp.propTypes = {
  children: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------
