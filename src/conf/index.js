// -----------------------------------------------------------------------------

const APP_CONSTS = {
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
    add: { en: "Add", vi: "Thêm" },
    address: { en: "Address", vi: "Địa chỉ" },
    cancel: { en: "Cancel", vi: "Bỏ qua" },
    change: { en: "Change", vi: "Thay đổi" },
    club: { en: "Club", vi: "CLB" },
    edit: { en: "Edit", vi: "Sửa" },
    find: { en: "Find", vi: "Tìm kiếm" },
    infomation: { en: "Infomation", vi: "Thông tin" },
    join: { en: "Join", vi: "Tham gia" },
    name: { en: "Name", vi: "Tên" },
    none: { en: "None", vi: "Không" },
    save: { en: "Save", vi: "Lưu lại" },
    update: { en: "Update", vi: "Cập nhật" }
  }
};

// -----------------------------------------------------------------------------

export default APP_CONSTS;

// -----------------------------------------------------------------------------
