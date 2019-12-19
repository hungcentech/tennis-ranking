// -----------------------------------------------------------------------------

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
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Verified">Verified</option>
                <option value="Closed">Closed</option>
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
                  Clear
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

// MatchFilter.propTypes = {
//   setFilter: React.PropTypes.func.isRequired,
//   initFilter: React.PropTypes.object.isRequired
// };

// -----------------------------------------------------------------------------
