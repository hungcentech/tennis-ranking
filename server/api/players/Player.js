// -----------------------------------------------------------------------------

import logger from "../../logger";

// -----------------------------------------------------------------------------

const fieldList = {
  status: "required", // active/inactive
  name: "required",
  facebook: "optional",
  avatar: "optional",
  contacts: "optional",
  clubs: "required",
  updates: "optional"
};

// -------------------------------------

const fieldValidation = {
  status: { active: true, inactive: true }
};

// -----------------------------------------------------------------------------

export async function validate(apiReq) {
  return new Promise((resolve, reject) => {
    try {
      // DEBUG:
      // logger.debug(`api.clubs.Player.validate(): apiReq = ${JSON.stringify(apiReq)}`);
      let errors = [];

      // Init arrays
      if (!apiReq.data.clubs) {
        apiReq.data.clubs = [];
      }
      if (!apiReq.data.updates) {
        apiReq.data.updates = [];
      }

      // Check required fields
      Object.keys(fieldList).forEach(field => {
        if (fieldList[field] === "required" && !apiReq.data[field]) {
          errors.push(`Missing mandatory field: ${field}`);
        }
      });

      // Validate fields' value
      Object.keys(fieldValidation).forEach(field => {
        if (apiReq.data[field] && !fieldValidation[field][apiReq.data[field]]) {
          errors.push(`${apiReq.data[field]} is not a valid ${field}.`);
        }
      });

      // Set default values
      if (errors.length == 0) {
        // Update time, comment & user id
        if (!apiReq.comment && !apiReq.data.updates.length) apiReq.comment = "Creation";
        apiReq.data.updates.push({ updated: new Date(), comment: apiReq.comment, updatedBy: apiReq.uid });
      }

      if (errors.length) reject(errors.join("; "));
      else resolve(apiReq);
    } catch (err) {
      reject(err);
    }
  });
}

// -----------------------------------------------------------------------------
