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
  //   token: "ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234",
  //   function: "xxxx yyyy"
  // }
  logger.debug(`auth.check(): apiReq = ${JSON.stringify(apiReq)}`);

  return new Promise((resolve, reject) => {
    let filter = {
      token: apiReq.token
    };

    if (!apiReq.function) {
      let error = new Error(`auth.check(): Authentication failed, apiReq.function is undefined`);
      logger.debug(error);
      reject(error);
    } else {
      // Authentication & authorization
      db.collection("players")
        .find({ token: apiReq.token })
        .limit(1)
        .next()
        .then(user => {
          if (!user) {
            let error = new Error(`auth.check(): Authentication failed, user not found with ${JSON.stringify(filter)}`);
            logger.debug(error);
            reject(error);
          } else {
            // Authentication success => check authorization
            logger.debug(`auth.check(): User found: ${JSON.stringify(user)}`);

            // Authorization:
            //   Read, Create => always allowed
            //   Update: can only modify him self, or must be admin (owner) of the object
            let fitems = apiReq.function.split(/[ ]+/, 2);
            let fname = fitems[0],
              ftarget = fitems[1];
            logger.debug(`auth.check(): fitems = ${fitems.join(", ")}, fname = ${fname}, ftarget = ${ftarget}`);

            if (!fname || !ftarget) {
              let error = new Error("auth.check(): Authorization failed: function name or target is undefined");
              logger.debug(error);
              reject(error);
            } else {
              if ("update" == fname) {
                if (!apiReq.data || !apiReq.id) {
                  let error = new Error("auth.check(): Authorization failed: target id/data not set");
                  logger.debug(error);
                  reject(error);

                  // DEBUG
                  if (apiReq.id == user._id) {
                    // Modifying him self => OK
                    apiReq.user = { id: user._id, facebook: user.facebook };
                    resolve(apiReq);
                  } else {
                    db.collection(ftarget)
                      .find({ _id: ObjectId(apiReq.id) })
                      .limit(1)
                      .next()
                      .then(target => {
                        let authorized = false;

                        if (target && target.admins) {
                          target.admins.foreach(adm => {
                            if (adm._id == user._id) {
                              // user is owner (admin) of target => OK
                              apiReq.user = { id: user._id, facebook: user.facebook };
                              resolve(apiReq);
                            }
                          });
                        }

                        if (!authorized) {
                          let error = new Error("auth.check(): Authorization failed: not self nor owner");
                          logger.debug(error);
                          reject(error);
                        }
                      })
                      .catch(err => {
                        let error = new Error(`auth.check(): Authorization failed: ${err}`);
                        logger.debug(error);
                        reject(error);
                      });
                  }
                } else {
                  apiReq.user = { id: user._id, facebook: user.facebook };
                  resolve(apiReq);
                }
              } else {
                apiReq.user = { id: user._id, facebook: user.facebook };
                resolve(apiReq);
              }
            }
          }
        })
        .catch(err => {
          let error = new Error(`auth.check(): find() error. Authorization failed: ${err}`);
          logger.debug(error);
          reject(error);
        });
    }
  });
}

// -----------------------------------------------------------------------------
