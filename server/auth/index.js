// -----------------------------------------------------------------------------

import logger from "../logger";

// -----------------------------------------------------------------------------

export async function authorizationCheck(db, reqData) {
  return new Promise((resolve, reject) => {
    // await db.collection("clubs")
    //       .insertOne(validated.record)
    //       .then(result =>
    //         db
    //           .collection("clubs")
    //           .find({ _id: result.insertedId })
    //           .limit(1)
    //           .next()
    //       )
    //       .then(record => {
    //         logger.debug(`api.clubs.create(): Inserted record =`, record);
    //         res.json({ inserted: record });
    //       })
    //       .catch(err => {
    //         logger.warn(`api.clubs.create(): error =`, err);
    //         res.status(500).json({ error: `Internal Server Error: ${err}` });
    //       });
    //   });

    let passed = false;

    if (passed) {
      resolve(reqData);
    } else {
      reject("Authorization failed");
    }
  });
}

// -----------------------------------------------------------------------------
