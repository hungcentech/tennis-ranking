"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// -----------------------------------------------------------------------------
var validMatchStatus = {
  New: true,
  Playing: true,
  Finished: true
}; // -------------------------------------

var matchFieldType = {
  type: "required",
  // "single/double"
  format: "required",
  // "sets 1, games upto 6:5, no tiebeak, deciding point @ 50", "sets 1, games upto 5:5, no tiebeak, deciding point @ 40"
  status: "required",
  // validMatchStatus
  teams: "required",
  // "{a: [{id: "", name: ""}, {id: "", name: ""}], b: [{id: "", name: ""}, {id: "", name: ""}]}"
  scores: "required",
  // {set: [0, 0], game: [3, 4], point: [40, 15]}
  referees: "required",
  // [{id: "", name: ""}]
  created: "required",
  // Date("2019-12-15T09:16:24+07:00")
  begin_date: "required",
  // Date("2019-12-15T09:16:24+07:00")
  end_date: "required" // Date("2019-12-15T09:16:24+07:00")

}; // -------------------------------------

function cleanupMatch(match) {
  var cleanedUpMatch = {};
  Object.keys(match).forEach(function (field) {
    if (matchFieldType[field]) cleanedUpMatch[field] = match[field];
  });
  if (!cleanedUpMatch["effort"]) cleanedUpMatch["effort"] = 0;
  return cleanedUpMatch;
} // -------------------------------------


function validateMatch(match) {
  var errors = [];
  Object.keys(matchFieldType).forEach(function (field) {
    if (matchFieldType[field] === "required" && !match[field]) {
      errors.push("Missing mandatory field: ".concat(field));
    }
  });

  if (!validMatchStatus[match.status]) {
    errors.push("".concat(match.status, " is not a valid status."));
  }

  return errors.length ? errors.join("; ") : null;
} // -------------------------------------


function convertMatch(match) {
  if (match.created) match.created = new Date(match.created);
  if (match.completionDate) match.completionDate = new Date(match.completionDate);
  return cleanupMatch(match);
} // -----------------------------------------------------------------------------


var _default = {
  validateMatch: validateMatch,
  cleanupMatch: cleanupMatch,
  convertMatch: convertMatch
}; // -----------------------------------------------------------------------------

exports["default"] = _default;
//# sourceMappingURL=match.js.map