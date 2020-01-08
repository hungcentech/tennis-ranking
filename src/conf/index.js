// -----------------------------------------------------------------------------

const APP_CONSTS = {
  // appDomain: "https://bme.hust.edu.vn",
  appDomain: "http://localhost",
  appUrl: "/tennisrankings",
  loginUrl: "/auth/facebook/login",
  logoutUrl: "/auth/facebook/logout",

  locations: {
    "/home": { appBar: { title: "Tennis Rankings", leftBtn: { icon: "Home", url: "/home" } } },
    "/my_club": { appBar: { title: "My Club", leftBtn: { icon: "Home", url: "/home" } } },
    "/rankings": { appBar: { title: "Rankings", leftBtn: { icon: "Home", url: "/home" } } },
    "/new_match": { appBar: { title: "New Match", leftBtn: { icon: "Home", url: "/home" } } },
    "/history": { appBar: { title: "Recent Matches", leftBtn: { icon: "Home", url: "/home" } } }
  },

  homeItems: [
    { imgUrl: "/img/home_my_club.jpg", title: "My Club", url: "/my_club" },
    { imgUrl: "/img/home_rankings.jpg", title: "Rankings", url: "/rankings" },
    { imgUrl: "/img/home_new_match.jpg", title: "New Match", url: "/new_match" },
    { imgUrl: "/img/home_history.jpg", title: "History", url: "/history" }
  ]
};

// -----------------------------------------------------------------------------

export default APP_CONSTS;

// -----------------------------------------------------------------------------
