// -----------------------------------------------------------------------------

import logger from "../logger";
import { ObjectId } from "mongodb";

// -----------------------------------------------------------------------------

export async function authCheck(db, apiReq) {
  return new Promise((resolve, reject) => {
    let filter = {
      _id: new ObjectId(apiReq.uid)
      // token: apiReq.token
    };
    db.collection("players")
      .find(filter)
      .limit(1)
      .next()
      .then(player => {
        if (player) {
          logger.debug(`auth.check(): A player/user found with ${JSON.stringify(filter)}: ${JSON.stringify(player)}`);
          resolve(apiReq);
        } else {
          logger.debug(`auth.check(): No player/user found with ${JSON.stringify(filter)}`);
          reject(Error("Authorization failed"));
        }
      })
      .catch(err => {
        logger.debug(`auth.check(): Server error: ${err}`);
        reject(err);
      });
  });
}

// -----------------------------------------------------------------------------
