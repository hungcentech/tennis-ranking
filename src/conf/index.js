// -----------------------------------------------------------------------------

const APP_CONSTS = {
  // appDomain: "https://bme.hust.edu.vn",
  appDomain: "http://localhost",
  appUrl: "/tennisrankings",
  loginUrl: "/auth/facebook/login",
  logoutUrl: "/auth/facebook/logout",

  locations: {
    "/home": {
      img: "/img/home.jpg",
      title: "Home",
      url: "/home",
      appBar: { title: { main: "Tennis Rankings" }, leftBtn: { icon: undefined, url: "/home" } }
    },
    "/players": {
      img: "/img/players.jpg",
      title: "My Club",
      url: "/players",
      appBar: { title: { main: "My Club" }, leftBtn: { icon: undefined, url: "/home" } }
    },
    "/stats": {
      img: "/img/stats.jpg",
      title: "Rankings",
      url: "/stats",
      appBar: { title: { main: "Rankings" }, leftBtn: { icon: undefined, url: "/home" } }
    },
    "/play": {
      img: "/img/play.jpg",
      title: "New Match",
      url: "/play",
      appBar: { title: { main: "New Match" }, leftBtn: { icon: undefined, url: "/home" } }
    },
    "/matches": {
      img: "/img/matches.jpg",
      title: "History",
      url: "/matches",
      appBar: { title: { main: "Recent Matches" }, leftBtn: { icon: undefined, url: "/home" } }
    },
    "/clubs": {
      img: "/img/clubs.jpg",
      title: "Clubs",
      url: "/clubs",
      appBar: { title: { main: "Other Clubs", noClub: "Join Club" }, leftBtn: { icon: undefined, url: "/home" } }
    },
    "/news": {
      img: "/img/news.jpg",
      title: "News",
      url: "/news",
      appBar: { title: { main: "Tennis News" }, leftBtn: { icon: undefined, url: "/home" } }
    }
  },

  clubsUrl: "/clubs"
};

// -----------------------------------------------------------------------------

export default APP_CONSTS;

// -----------------------------------------------------------------------------
