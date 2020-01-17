// -----------------------------------------------------------------------------

import logger from "../logger";
import { ObjectId } from "mongodb";

// -----------------------------------------------------------------------------

export async function authCheck(db, apiReq) {
  // apiReq: {
  //   data: {
  //     id: "345093845098234",
  //     name: "",
  //     admins: [],
  //     ...
  //   },
  //   token: "",
  //   function: ""
  // }
  logger.debug(`auth.check(): apiReq = ${JSON.stringify(apiReq)}`);

  return new Promise((resolve, reject) => {
    let filter = {
      token: apiReq.token
    };

    // Authentication & authorization
    db.collection("players")
      .find({ token: apiReq.token })
      .limit(1)
      .next()
      .then(player => {
        if (player) {
          // Authentication: success
          logger.debug(`auth.check(): A player/user found with ${JSON.stringify(filter)}: ${JSON.stringify(player)}`);

          // Authorization:
          //   Read, Create => always allowed
          //   Update: can only modify him self, or must be admin of the object
          let authorized = true;

          if (apiReq.function && apiReq.function.startsWith("update")) {
            authorized = false;
            if (apiReq.data && apiReq.data.id == player._id) {
              authorized = true;
            } else {
              if (apiReq.admins) {
                apiReq.admins.foreach(adm => {
                  authorized = authorized || player._id == adm.id;
                });
              }
            }
          }

          if (authorized) {
            resolve(apiReq);
          } else {
            reject(Error("Not authorized"));
          }
        } else {
          logger.debug(`auth.check(): No player/user found with ${JSON.stringify(filter)}`);
          reject(Error("Authentication failed"));
        }
      })
      .catch(err => {
        logger.debug(`auth.check(): Server error: ${err}`);
        reject(err);
      });
  });
}

// -----------------------------------------------------------------------------
