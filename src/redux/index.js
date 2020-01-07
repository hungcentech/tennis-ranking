// -----------------------------------------------------------------------------

import { createStore } from "redux";

// -----------------------------------------------------------------------------

export const INITIAL_STATE = {
  // consts //

  config: {
    appUrl: "/tennisrankings",
    loginUrl: "/auth/facebook/login",
    logoutUrl: "/auth/facebook/logout"
  },

  locations: {
    "/home": { appBar: { title: "Tennis Rankings", leftBtn: { icon: "ArrowBack" }, rightBtn: { icon: "Facebook" } } },
    "/my_club": { appBar: { title: "My Club" } },
    "/rankings": { appBar: { title: "Rankings" } },
    "/new_match": { appBar: { title: "New Match" } },
    "/history": { appBar: { title: "Recent Matches" } },
    "/players": { appBar: { title: "Players" } }
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

  // variables //

  user: {
    uid: undefined,
    token: undefined
  },

  // location: undefined, // appUrl ? router.location.pathname.substr(appUrl.length) : router.location.pathname;

  lastUpdated: 0

  // -- -- //
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
