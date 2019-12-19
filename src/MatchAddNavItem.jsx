// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router";
import {
  NavItem,
  Glyphicon,
  Modal,
  Form,
  FormGroup,
  Col,
  FormControl,
  ControlLabel,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import Toast from "./Toast.jsx";

// -----------------------------------------------------------------------------

class MatchAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: {
        type: "Double",
        format: "Set: 1, Game: 6-5, Tiebeak: No, DecidingPoint: 50",
        teams: { a: [{ id: "", name: "" }], b: [{ id: "", name: "" }] }
      },
      showing: false,
      toastVisible: false,
      toastMessage: "",
      toastType: "success"
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  // -------------------------------------

  showModal() {
    this.setState({ showing: true });
  }

  // -------------------------------------

  hideModal() {
    this.setState({ showing: false });
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

  handleChange(event, convertedValue) {
    const match = { ...this.state.match };
    const value = convertedValue !== undefined ? convertedValue : event.target.value;
    match[event.target.name] = value;
    this.setState({ match });
  }

  // -------------------------------------

  handleSubmit(event) {
    event.preventDefault();
    this.hideModal();
    const form = document.forms.matchAdd;

    // type: "required", // "single/double"
    // format: "required", // "Set: 1, Game: 6-5, Tiebeak: No, DecidingPoint: 50"
    // status: "required", // validMatchStatus
    // teams: "required", // "{a: [{id: "", name: ""}, {id: "", name: ""}], b: [{id: "", name: ""}, {id: "", name: ""}]}"
    // scores: "required", // {set: [0, 0], game: [3, 4], point: [40, 15]}
    // referee: "required", // {id: "", name: ""}
    // created: "optional", // Date("2019-12-15T09:16:24.324+07:00")
    // begin_date: "optional", // Date("2019-12-15T09:16:24.358+07:00")
    // end_date: "optional" // Date("2019-12-15T09:16:24.545+07:00")

    fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.match)
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(updatedMatch => {
              this.props.router.push(`/matches/${updatedMatch._id}`);
            })
            .catch(err => {
              this.showError("Server connection error: " + err.message);
            });
        } else {
          response
            .json()
            .then(err => {
              this.showError(`Failed to add match: ${err.message}`);
            })
            .catch(err => {
              this.showError("Server connection error: " + err.message);
            });
        }
      })
      .catch(err => {
        this.showError(`Error in sending data to server: ${err.message}`);
      });
  }

  // -------------------------------------

  render() {
    return (
      <NavItem>
        <div onClick={this.showModal}>
          <Glyphicon glyph="plus" /> Add Match
        </div>

        {/* prettier-ignore */}
        <Modal show={this.state.showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Match</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal name="matchAdd">
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>Type</Col>
                <Col sm={9}>
                  <FormControl componentClass="select" name="type" value={this.state.match.type} onChange={this.handleChange} autoFocus>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                  </FormControl>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>Format</Col>
                <Col sm={9}>
                  <FormControl componentClass="select" name="format" value={this.state.match.format} onChange={this.handleChange}>
                    <option value="Set: 1, Game: 5-5, Tiebeak: No, DecidingPoint: 40">Set: 1, Game: 5-5, Tiebeak: No, DecidingPoint: 40</option>
                    <option value="Set: 1, Game: 6-5, Tiebeak: No, DecidingPoint: 50">Set: 1, Game: 6-5, Tiebeak: No, DecidingPoint: 50</option>
                  </FormControl>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>Teams:</Col>
                  <FormControl componentClass="select" name="playerA1" value={this.state.match.teams.a[0].id} onChange={this.handleChange} autoFocus>
                    {this.props.players.map(player => (<option value={player.id}>{player.name}</option>))}                    
                  </FormControl>
                <Col sm={3} componentClass={ControlLabel}>Teams</Col>
                <Col sm={9}>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button type="button" bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>

        <Toast
          showing={this.state.toastVisible}
          message={this.state.toastMessage}
          onDismiss={this.dismissToast}
          bsStyle={this.state.toastType}
        />
      </NavItem>
    );
  }
}

// -----------------------------------------------------------------------------

MatchAddNavItem.propTypes = {
  router: PropTypes.object
};

// -----------------------------------------------------------------------------

export default withRouter(MatchAddNavItem);

// -----------------------------------------------------------------------------
