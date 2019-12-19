// -----------------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Redirect, browserHistory, withRouter } from "react-router";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
// import MatchList from "./MatchList.jsx";
// import MatchEdit from "./MatchEdit.jsx";
// import MatchAddNavItem from "./MatchAddNavItem.jsx";
// import PlayerList from "./PlayerList.jsx";
// import PlayerEdit from "./PlayerEdit.jsx";
// import PlayerAddNavItem from "./PlayerAddNavItem.jsx";

// -----------------------------------------------------------------------------

const contentNode = document.getElementById("contents");
const NotFound = () => <p>Page Not Found</p>;

// -----------------------------------------------------------------------------

const Header = () => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>Tennis GM Rankings</Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to="/matches">
        <NavItem>Matches</NavItem>
      </LinkContainer>
      <LinkContainer to="/players">
        <NavItem>Players</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      {/* <MatchAddNavItem /> */}
      <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal" />} noCaret>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
);

// -----------------------------------------------------------------------------

const App = props => (
  <div>
    <Header />
    <div className="container-fluid">
      {props.children}
      <hr />
      <h5>
        <small>
          Full source code available at this
          <a href="https://github.com/vasansr/pro-mern-stack"> GitHub repository</a>.
        </small>
      </h5>
    </div>
  </div>
);

// -------------------------------------

// App.propTypes = {
//   children: React.PropTypes.object.isRequired
// };

// -----------------------------------------------------------------------------

const RoutedApp = () => (
  <Router history={browserHistory}>
    {/* <Redirect from="/" to="/matches" /> */}
    <Route path="/" component={App}>
      {/* <Route path="matches" component={withRouter(MatchList)} /> */}
      {/* <Route path="matches/:id" component={MatchEdit} /> */}
      {/* <Route path="players" component={withRouter(PlayerList)} /> */}
      {/* <Route path="players/:id" component={PlayerEdit} /> */}
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

// -----------------------------------------------------------------------------

ReactDOM.render(<RoutedApp />, contentNode);

if (module.hot) {
  module.hot.accept();
}

// -----------------------------------------------------------------------------
