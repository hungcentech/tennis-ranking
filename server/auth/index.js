// -----------------------------------------------------------------------------

import logger from "../logger";
import { ObjectId } from "mongodb";

// -----------------------------------------------------------------------------

export async function authCheck(db, apiReq) {
  return new Promise((resolve, reject) => {
    let filter = {
      _id: new ObjectId(apiReq.user._id)
      // token: apiReq.token
    };
    db.collection("players")
      .find(filter)
      .limit(1)
      .next()
      .then(player => {
        if (player) {
          logger.debug(`auth.check(): A player/user found with ${JSON.stringify(filter)}: ${JSON.stringify(player)}`);
          let authorized = false;
          if (apiReq.user._id == apiReq.data._id) authorized = true;
          else {
            if (apiReq.admins)
              apiReq.admins.foreach(adm => {
                authorized = authorized || apiReq.user._id == adm._id;
              });
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
