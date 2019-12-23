// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router";

import { Table } from "@material-ui/core/Table";
// import { Button, Glyphicon, Table, Panel } from "react-bootstrap";

// import MatchFilter from "./MatchFilter.jsx";
// import Toast from "./Toast.jsx";

// -----------------------------------------------------------------------------

const MatchRow = props => {
  function onDeleteClick() {
    props.deleteMatch(props.match._id);
  }

  const dateFormat = date => {
    // return `${date.getDate()}-${1 + date.getMonth()}-${date.getFullYear()} ${1 + date.getHours()}:${date.getMinutes()}`;
    return date.toLocaleString();
  };

  return (
    <tr>
      {/* <td><Link to={`/matches/${props.match._id}`}>{props.match._id.substr(-4)}</Link></td> */}
      {/* <td>{props.match.type}</td> */}
      {/* <td>{props.match.rules}</td> */}
      <td style={{ textAlign: "center" }}>
        <Link to={`/matches/${props.match._id}`}>{props.match.status}</Link>
      </td>
      <td style={{ textAlign: "right" }}>
        {props.match.teams && props.match.teams.length > 0 ? props.match.teams[0].map(r => r.name).join(", ") : ""}
      </td>
      <td style={{ textAlign: "center" }}>
        {props.match.scores && props.match.scores.games ? props.match.scores.games.join(" : ") : ""}
      </td>
      <td style={{ textAlign: "left" }}>
        {props.match.teams && props.match.teams.length > 1 ? props.match.teams[1].map(r => r.name).join(", ") : ""}
      </td>
      {/* <td>{props.match.begin ? dateFormat(new Date(props.match.begin)) : ""}</td> */}
      <td style={{ textAlign: "center" }}>{props.match.end ? dateFormat(new Date(props.match.end)) : ""}</td>
      {/* <td>{props.match.referees ? props.match.referees.map(r => r.name).join(", ") : ""}</td> */}
      <td style={{ textAlign: "center" }}>
        {/* <Button bsStyle="info" bsSize="xsmall">
          <Link to={`/matches/${props.match._id}`}>
            <Glyphicon glyph="edit" />
          </Link>
        </Button> */}
      </td>
      <td style={{ textAlign: "center" }}>
        {/* <Button bsStyle="danger" bsSize="xsmall" onClick={onDeleteClick} disabled>
          <Glyphicon glyph="trash" />
        </Button> */}
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
      <div>
        {/* <Table bordered condensed hover responsive> */}
        <table>
          <thead>
            <tr>
              {/* <th>Id</th> */}
              {/* <th>Đơn/Đôi</th> */}
              {/* <th>Luật</th> */}
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "right" }}>Team 1</th>
              <th style={{ textAlign: "center" }}>Score</th>
              <th style={{ textAlign: "left" }}>Team 2</th>
              {/* <th>Bắt đầu</th> */}
              <th style={{ textAlign: "center" }}>Finish</th>
              {/* <th>Trọng tài</th> */}
              <th style={{ textAlign: "center" }}>Edit</th>
              <th style={{ textAlign: "center" }}>x</th>
            </tr>
          </thead>
          <tbody>{matchRows}</tbody>
        </table>
        {/* </Table> */}
      </div>
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
    console.log(`MatchList.setFilter(): router location: ${JSON.stringify(this.props.router.location)}`);
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
        {/* <Panel bsStyle="info" defaultExpanded> */}
        <div>
          {/* <Panel.Heading> */}
          {/* <Panel.Title> */}
          <div>Filter</div>
          {/* </Panel.Title> */}
          {/* </Panel.Heading> */}
          {/* <Panel.Collapse> */}
          {/* <Panel.Body> */}
          {/* <MatchFilter setFilter={this.setFilter} filter={this.props.location.query} /> */}
          {/* </Panel.Body> */}
          {/* </Panel.Collapse> */}
        </div>
        {/* </Panel> */}
        <MatchTable matches={this.state.matches} deleteMatch={this.deleteMatch} />
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
