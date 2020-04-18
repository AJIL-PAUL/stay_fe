export default {

  register: {
    path: '/api/v1/auth/register',
    method: 'POST',
    noAuth: true
  },
  addFacility: {
    path: "/api/v1/facility/add-facility",
    method: "POST",
    noAuth: false
  },
  login: {
    path: '/api/v1/auth/login',
    method: 'POST',
    noAuth: true
  },

  currentUser: {
    path: '/api/v1/auth/user',
    noAuth: false
  },
  getHotelDetails: {
    path: '/api/v1/rooms',
    method: 'GET',
    noAuth: true
  },
  getOptionlist: {
    path: 'api/v1/rooms/get/details',
    noAuth: true
  },
  getDistricts: {
    path: '/api/v1/facility/get/districts',
    noAuth: true
  }
}
