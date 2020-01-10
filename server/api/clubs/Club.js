// -----------------------------------------------------------------------------

const fieldList = {
  status: "required",
  name: "required",
  description: "optional",
  avatar: "optional",
  address: "required",
  contacts: "optional",
  updates: "optional"
};

// -------------------------------------

const fieldValidation = {
  status: { active: true, inactive: true }
};

// -------------------------------------

function validate(reqData) {
  let errors = [];

  // Init array of updates
  if (!reqData.record.updates) {
    reqData.record.updates = [];
  }

  // Check required fields
  Object.keys(fieldList).forEach(field => {
    if (fieldList[field] === "required" && !reqData.record[field]) {
      errors.push(`Missing mandatory field: ${field}`);
    }
  });

  // Validate fields' value
  if (!fieldValidation["status"][reqData.record.status]) {
    errors.push(`${reqData.record.status} is not a valid status.`);
  }

  // Set default values
  if (errors.length == 0) {
    if (!reqData.comment && !reqData.record.updates.length) reqData.comment = "Creation";

    // Update time, comment & user id
    reqData.record.updates.push({ updated: new Date(), comment: reqData.comment, updatedBy: reqData.user._id });
  }

  return {
    record: reqData.record,
    error: errors.length ? errors.join("; ") : undefined
  };
}

// -----------------------------------------------------------------------------

export default {
  validate
};

// -----------------------------------------------------------------------------
