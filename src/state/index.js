// -----------------------------------------------------------------------------

import { createStore } from "redux";

// -----------------------------------------------------------------------------

const INITIAL_STATE = {
  user: undefined, // { id: undefined, token: undefined, name: undefined, avatar: undefined, facebook: undefined },
  time: 0 // timestamp
};

// -----------------------------------------------------------------------------

const reducer = (state, action) => {
  let newState = state;

  // DEBUG
  // console.log("reducer: old state = ", state, ", action = ", action);

  switch (action.type) {
    case "user_update": {
      newState = {
        ...state,
        time: Date.now(),
        user: action.payload
      };
    }
  }

  // DEBUG
  // console.log("reducer: new state: ", newState);

  return newState;
};

// -----------------------------------------------------------------------------

export function initStore() {
  return createStore(reducer, INITIAL_STATE);
}

// -----------------------------------------------------------------------------
