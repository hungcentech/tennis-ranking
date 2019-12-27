// -----------------------------------------------------------------------------

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

import { TableContainer, Paper } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { IconButton, CircularProgress } from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

// -----------------------------------------------------------------------------

const LoadingProgress = ({ loading }) => {
  return loading ? (
    <div align="center">
      <p />
      <CircularProgress />
      <p />
    </div>
  ) : null;
};

// -----------------------------------------------------------------------------

const styles = theme => ({
  root: {
    marginTop: 10,
    marginLeft: 0
  }
});

// -----------------------------------------------------------------------------

const MatchList = withStyles(styles)(({ classes, location }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------

  useEffect(() => {
    let uri = `/api/matches${location.search}`;
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
              setMatches(data.records);
              setLoading(false);
            })
            .catch(err => {
              console.log("Server connection error: " + err.message);
            });
        } else {
          response
            .json()
            .then(err => {
              console.log("Failed to fetch matches: " + err.message);
            })
            .catch(err => {
              console.log("Server connection error: " + err.message);
            });
        }
      })
      .catch(err => {
        console.log("Error in fetching data from server:", err.message);
      });
  }, []);

  // -------------------------------------

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Id</TableCell>
            <TableCell align="center">Type</TableCell>
            {/* <TableCell align="center">Rules</TableCell> */}
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Team 1</TableCell>
            <TableCell align="center">Scores</TableCell>
            <TableCell align="left">Team 2</TableCell>
            <TableCell align="center">Start</TableCell>
            <TableCell align="center">Finish</TableCell>
            <TableCell>Referees</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Del?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map(item => {
            return (
              <TableRow key={item._id}>
                <TableCell align="center">
                  <Link to={`/matches/${item._id}`}>{item._id.substr(-4)}</Link>
                </TableCell>
                <TableCell align="center">{item.type}</TableCell>
                {/* <TableCell align="center">{item.rules}</TableCell> */}
                <TableCell align="center">{item.status}</TableCell>
                <TableCell align="right">
                  {item.teams && item.teams.length > 0 ? item.teams[0].map(r => r.name).join(", ") : ""}
                </TableCell>
                <TableCell align="center">{item.scores && item.scores.games ? item.scores.games.join(" : ") : ""}</TableCell>
                <TableCell align="left">
                  {item.teams && item.teams.length > 1 ? item.teams[1].map(r => r.name).join(", ") : ""}
                </TableCell>
                <TableCell align="center">{item.begin ? new Date(item.begin).toLocaleString() : ""}</TableCell>
                <TableCell align="center">{item.end ? new Date(item.end).toLocaleString() : ""}</TableCell>
                <TableCell align="center">{item.referees ? item.referees.map(r => r.name).join(", ") : ""}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="edit" color="primary">
                    <Link to={`/matches/${item._id}`}>
                      <EditIcon />
                    </Link>
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="delete"
                    disabled
                    color="secondary"
                    onClick={() =>
                      fetch(`/api/matches/${id}`, { method: "DELETE" }).then(response => {
                        if (!response.ok) this.showError("Failed to delete match");
                        else this.loadData();
                      })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <LoadingProgress loading={loading} />
    </TableContainer>
  );
});

// -----------------------------------------------------------------------------

MatchList.propTypes = {
  location: PropTypes.object.isRequired
};

// -----------------------------------------------------------------------------

export default MatchList;

// -----------------------------------------------------------------------------
