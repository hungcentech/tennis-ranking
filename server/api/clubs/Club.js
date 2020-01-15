// -----------------------------------------------------------------------------

import logger from "../../logger";

// -----------------------------------------------------------------------------

const fieldList = {
  status: "optional",
  name: "required",
  address: "required",
  admins: "optional",
  description: "optional",
  avatar: "optional",
  changes: "optional"
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
      // logger.debug(`api.clubs.Club.validate(): apiReq = ${JSON.stringify(apiReq)}`);
      let errors = [];

      // Init array of admins
      if (!apiReq.data.admins) {
        apiReq.data.admins = [];
      }

      // Init array of changes
      if (!apiReq.data.changes) {
        apiReq.data.changes = [];
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
        if (!apiReq.data.status) {
          apiReq.data.status = "active";
        }

        // Insert default admin
        if (!apiReq.data.admins.length) {
          apiReq.data.admins.push(user);
        }

        // Date, updater, change
        if (!apiReq.change && !apiReq.data.changes.length) {
          apiReq.change = "Creation";
        }
        apiReq.data.changes.push({ date: new Date(), user: apiReq.user, change: apiReq.change });
      }

      if (errors.length) reject(errors.join("; "));
      else resolve(apiReq);
    } catch (err) {
      reject(err);
    }
  });
}

// -----------------------------------------------------------------------------
