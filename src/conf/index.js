// -----------------------------------------------------------------------------

const APP_CONSTS = {
  // appDomain: "https://bme.hust.edu.vn",
  appDomain: "http://localhost",
  urls: {
    app: "/tennisrankings",
    login: "/auth/facebook/login",
    logout: "/auth/facebook/logout",
    clubs: "/clubs",
    home: "/home"
  },

  locations: {
    "/home": {
      img: "/img/home.jpg",
      title: { en: "Home", vi: "Nhà" },
      url: "/home",
      appBar: { title: { en: "Tennis Rankings", vi: "Bảng Xếp hạng" } }
    },
    "/play": {
      img: "/img/play.jpg",
      title: { en: "New Match", vi: "Trận mới" },
      url: "/play",
      // emphasized: "primary",
      appBar: { title: { en: "New Match", vi: "Thêm trận mới" } }
    },
    "/players": {
      img: "/img/players.jpg",
      title: { en: "My Club", vi: "CLB của tôi" },
      url: "/players",
      appBar: { title: { en: "My Club", vi: "CLB của tôi" } }
    },
    "/stats": {
      img: "/img/stats.jpg",
      title: { en: "Rankings", vi: "Xếp hạng" },
      url: "/stats",
      // emphasized: "secondary",
      appBar: { title: { en: "Rankings", vi: "Xếp hạng" } }
    },
    "/matches": {
      img: "/img/matches.jpg",
      title: { en: "History", vi: "Lịch sử" },
      url: "/matches",
      appBar: { title: { en: "Recent Matches", vi: "Các trận gần đây" } }
    },
    "/clubs": {
      img: "/img/clubs.jpg",
      title: { en: "Clubs", vi: "Danh sách CLB" },
      url: "/clubs",
      appBar: { title: { en: "Clubs", vi: "Danh sách CLB" } }
    },
    "/news": {
      img: "/img/news.jpg",
      title: { en: "News", vi: "Tin tức" },
      url: "/news",
      appBar: { title: { en: "Tennis News", vi: "Tin tức" } }
    }
  },

  labels: {
    edit: { en: "Edit", vi: "Sửa" },
    joinClub: { en: "Join club", vi: "Tham gia" },
    findClub: { en: "Find club...", vi: "Tìm CLB..." },
    noClub: { en: "club: none", vi: "clb: chưa có" }
  }
};

// -----------------------------------------------------------------------------

export default APP_CONSTS;

// -----------------------------------------------------------------------------
