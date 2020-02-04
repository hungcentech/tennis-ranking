// -----------------------------------------------------------------------------

import logger from "../../logger";

// -----------------------------------------------------------------------------

const fieldList = {
  id: "optional", // ObjectId
  status: "optional", // String (active/inactive)
  name: "required", // String
  address: "required", // String
  notes: "optional", // String
  avatar: "optional", // Url string
  players: "optional", // Array of users {id, name, mem}, includes members & guests
  admins: "optional", // Array of user {id, name}
  changes: "optional" // Array of changes { date: Date, user: {id, name}, change: String }
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

      // Check required fields
      Object.keys(fieldList).forEach(field => {
        if (fieldList[field] == "required" && !apiReq.data[field]) {
          errors.push(`Missing mandatory field: ${field}`);
        }
      });

      // Validate input fields' value
      Object.keys(fieldValidation).forEach(field => {
        if (apiReq.data[field] && !fieldValidation[field][apiReq.data[field]]) {
          errors.push(`${apiReq.data[field]} is not a valid ${field}.`);
        }
      });

      // Set default values
      if (!errors.length) {
        if (!apiReq.data.status) {
          apiReq.data.status = "active";
        }

        // Init optional arrays:
        //
        //   admins
        if (!apiReq.data.admins) {
          apiReq.data.admins = [];
        }
        if (!apiReq.data.admins.length) {
          apiReq.data.admins.push(apiReq.user);
        }
        //   players
        if (!apiReq.data.players) {
          apiReq.data.players = [];
        }
        if (!apiReq.data.players.length) {
          apiReq.data.players.push(apiReq.user);
        }
      }

      if (errors.length) reject(errors.join("; "));
      else resolve(apiReq);
    } catch (err) {
      reject(err);
    }
  });
}

// -----------------------------------------------------------------------------
