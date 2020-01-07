// -----------------------------------------------------------------------------

import { createStore } from "redux";

// -----------------------------------------------------------------------------

export const INITIAL_STATE = {
  lastUpdated: 0,

  user: {},

  config: {
    appUrl: "/tennisrankings",
    loginUrl: "/auth/facebook/login",
    logoutUrl: "/auth/facebook/logout"
  },

  homeItems: [
    {
      imgUrl: "/img/home_my_club.jpg",
      title: "My Club",
      url: "/my_club"
    },
    {
      imgUrl: "/img/home_rankings.jpg",
      title: "Rankings",
      url: "/rankings"
    },
    {
      imgUrl: "/img/home_new_match.jpg",
      title: "New Match",
      url: "/new_match"
    },
    {
      imgUrl: "/img/home_history.jpg",
      title: "History",
      url: "/history"
    }
  ],

  locations: {
    "/home": { appBarTitle: "Tennis Rankings" },
    "/my_club": { appBarTitle: "My Club" },
    "/rankings": { appBarTitle: "Rankings" },
    "/new_match": { appBarTitle: "New Match" },
    "/history": { appBarTitle: "Recent Matches" },
    "/players": { appBarTitle: "Players" }
  }
};

// -----------------------------------------------------------------------------

function reducer(state, action) {
  switch (action.type) {
    case "change location": {
      return {
        ...state,
        lastUpdated: Date.now(),
        location: action.payload
      };
    }

    default:
      return state;
  }
}

// -----------------------------------------------------------------------------

export function initStore() {
  return createStore(reducer, INITIAL_STATE);
}

// -----------------------------------------------------------------------------
