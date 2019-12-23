// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";

import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import MatchList from "./MatchList.jsx";
// import MatchEdit from "./MatchEdit.jsx";
import MatchAddNavItem from "./MatchAddNavItem.jsx";
// import PlayerList from "./PlayerList.jsx";
// import PlayerEdit from "./PlayerEdit.jsx";
// import PlayerAddNavItem from "./PlayerAddNavItem.jsx";

// -----------------------------------------------------------------------------

const contentNode = document.getElementById("contents");
const NotFound = () => <p>Page Not Found</p>;

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

let theme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  shape: {
    borderRadius: 8
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  palette: {
    primary: {
      main: "#64b5f6",
      contrastText: "#000"
    },
    secondary: {
      main: "#e57373",
      contrastText: "#000"
    },
    error: {
      main: "#cf6679",
      contrastText: "#000"
    },
    type: "light"
    // type: "dark"
  }
});

// ------------------------------------

const TennisRankingsApp = props => (
  <div>
    {/* <Header /> */}
    <div className="container-fluid">
      {props.children}
      <hr />
      <h5>
        <small>
          Tennis Rankings @ <a href="https://">CLB Tennis Gió Mùa</a>.
        </small>
      </h5>
    </div>
  </div>
);

// -------------------------------------

TennisRankingsApp.propTypes = {
  children: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router history={browserHistory}>
      <Redirect from="/" to="/matches" />
      <Route path="/" component={TennisRankingsApp}>
        <Route path="matches" component={withRouter(MatchList)} />
        {/* <Route path="matches/:id" component={MatchEdit} /> */}
        {/* <Route path="players" component={withRouter(PlayerList)} /> */}
        {/* <Route path="players/:id" component={PlayerEdit} /> */}
        <Route path="*" component={NotFound} />
      </Route>
    </Router>{" "}
  </ThemeProvider>
);

// -----------------------------------------------------------------------------

ReactDOM.render(<App />, contentNode);

if (module.hot) {
  module.hot.accept();
}

// -----------------------------------------------------------------------------
