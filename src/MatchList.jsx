// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router";
import { Button, Glyphicon, Table, Panel } from "react-bootstrap";
import MatchFilter from "./MatchFilter.jsx";
import Toast from "./Toast.jsx";

// -----------------------------------------------------------------------------

const MatchRow = props => {
  function onDeleteClick() {
    props.deleteMatch(props.match._id);
  }

  return (
    <tr>
      <td>
        <Link to={`/matches/${props.match._id}`}>{props.match._id.substr(-4)}</Link>
      </td>
      <td>{props.match.status}</td>
      <td>{props.match.owner}</td>
      <td>{props.match.created.toDateString()}</td>
      <td>{props.match.effort}</td>
      <td>{props.match.completionDate ? props.match.completionDate.toDateString() : ""}</td>
      <td>{props.match.title}</td>
      <td>
        <Button bsStyle="danger" bsSize="xsmall" onClick={onDeleteClick} disabled>
          <Glyphicon glyph="trash" />
        </Button>
      </td>
    </tr>
  );
};

// -------------------------------------

MatchRow.propTypes = {
  match: PropTypes.object.isRequired,
  deleteMatch: PropTypes.func.isRequired
};

// -----------------------------------------------------------------------------

class MatchTable extends Component {
  render() {
    const matchRows = this.props.matches.map(match => (
      <MatchRow key={match._id} match={match} deleteMatch={this.props.deleteMatch} />
    ));
    return (
      <Table bordered condensed hover responsive>
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Effort</th>
            <th>Completion Date</th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{matchRows}</tbody>
      </Table>
    );
  }
}

// -------------------------------------

MatchTable.propTypes = {
  matches: PropTypes.array.isRequired,
  deleteMatch: PropTypes.func.isRequired
};

// -----------------------------------------------------------------------------

class MatchList extends Component {
  constructor() {
    super();
    this.state = {
      filterExpanded: true,
      matches: [],
      toastVisible: false,
      toastMessage: "",
      toastType: "success"
    };
    this.setFilter = this.setFilter.bind(this);
    this.deleteMatch = this.deleteMatch.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  // -------------------------------------

  deleteMatch(id) {
    fetch(`/api/matches/${id}`, { method: "DELETE" }).then(response => {
      if (!response.ok) this.showError("Failed to delete match");
      else this.loadData();
    });
  }

  // -------------------------------------

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: "danger" });
  }

  // -------------------------------------

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  // -------------------------------------

  setFilter(query) {
    this.props.router.push({ pathname: this.props.location.pathname, query });
    console.log(
      `MatchList.setFilter(): router location: ${JSON.stringify(this.props.router.location)}`
    );
  }

  // -------------------------------------

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.query;
    const newQuery = this.props.location.query;
    if (
      oldQuery.status === newQuery.status &&
      oldQuery.effort_gte === newQuery.effort_gte &&
      oldQuery.effort_lte === newQuery.effort_lte
    ) {
      return;
    }
    this.loadData();
  }

  // -------------------------------------

  componentDidMount() {
    this.loadData();
  }

  // -------------------------------------

  loadData() {
    let uri = `/api/matches${this.props.location.search}`;
    fetch(uri)
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(data => {
              data.records.forEach(match => {
                match.created = new Date(match.created);
                if (match.completionDate) match.completionDate = new Date(match.completionDate);
              });
              this.setState({ matches: data.records });
            })
            .catch(err => {
              this.showError("Server connection error: " + err.message);
            });
        } else {
          response
            .json()
            .then(err => {
              this.showError("Failed to fetch matches: " + err.message);
            })
            .catch(err => {
              this.showError("Server connection error: " + err.message);
            });
        }
      })
      .catch(err => {
        this.showError("Error in fetching data from server:", err.message);
      });
  }

  // -------------------------------------

  render() {
    return (
      <div>
        <Panel bsStyle="info" defaultExpanded>
          <Panel.Heading>
            <Panel.Title>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              {/* <MatchFilter setFilter={this.setFilter} filter={this.props.location.query} /> */}
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        {/* <MatchTable matches={this.state.matches} deleteMatch={this.deleteMatch} /> */}
        {/* <Toast
          showing={this.state.toastVisible}
          message={this.state.toastMessage}
          onDismiss={this.dismissToast}
          bsStyle={this.state.toastType}
        /> */}
      </div>
    );
  }
}

// -------------------------------------

MatchList.propTypes = {
  location: PropTypes.object.isRequired,
  router: PropTypes.object
};

// -----------------------------------------------------------------------------

export default MatchList;

// -----------------------------------------------------------------------------
