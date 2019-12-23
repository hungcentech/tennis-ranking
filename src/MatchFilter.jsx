// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Col,
  Row,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
  ButtonToolbar,
  Button
} from "react-bootstrap";

// -----------------------------------------------------------------------------

export default class MatchFilter extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Status</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={this.props.filter.status || ""}
                onChange={e => {
                  this.props.setFilter({ ...this.props.filter, status: e.target.value });
                }}
              >
                <option value="">(Any)</option>
                <option value="playing">playing</option>
                <option value="finished">finished</option>
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Effort</ControlLabel>
              <InputGroup>
                <FormControl
                  value={this.props.filter.effort_gte || ""}
                  onChange={e => {
                    let n = parseInt(e.target.value);
                    this.props.setFilter({ ...this.props.filter, effort_gte: isNaN(n) ? "" : n });
                  }}
                />
                <InputGroup.Addon>-</InputGroup.Addon>
                <FormControl
                  value={this.props.filter.effort_lte || ""}
                  onChange={e => {
                    let n = parseInt(e.target.value);
                    this.props.setFilter({ ...this.props.filter, effort_lte: isNaN(n) ? "" : n });
                  }}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>&nbsp;</ControlLabel>
              <ButtonToolbar>
                <Button
                  bsStyle="success"
                  onClick={e => {
                    this.props.setFilter({});
                  }}
                >
                  Show All
                </Button>
              </ButtonToolbar>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

// -------------------------------------

MatchFilter.propTypes = {
  setFilter: PropTypes.func.isRequired
};

// -----------------------------------------------------------------------------
