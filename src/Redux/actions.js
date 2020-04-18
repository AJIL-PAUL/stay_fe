import { fireRequest, actions } from "./fireRequest";

export const postRegister = (form) => {
  return fireRequest("register", [], form);
};
export const postLogin = (form) => {
  return fireRequest("login", [], form);
};
export const changePassword = (form) => {
  return fireRequest("changepassword", [], form);
};

export const postAddHotel = (form) => {
  return fireRequest("addFacility", [], form);
};
export const getBookingHistory = (form) => {
  return fireRequest("bookingHistory", [form.id]);
};
export const getCurrentUser = () => {
  return fireRequest("currentUser");
};
export const getUserHotelList = (id) => {
  return fireRequest("userHotelList", [id]);
};
export const getHotelRoomList = (id) => {
  return fireRequest("hotelRoomList", [id]);
};
export const getHotelBookingList = (id) => {
  return fireRequest("hotelBookingList", [id]);
};
export const getHotelList = (params) => {
  return fireRequest("getHotelDetails", [], params);
};
export const getOptionlist = () => {
  return fireRequest("getOptionlist");
};
export const getDistricts = () => {
  return fireRequest("getDistricts");
};

export const getRoomByHotelid = (id) => {
  return fireRequest("roomByHotelId", [id]);
};
export const getRoomByRoomid = (id) => {
  return fireRequest("roomByRoomId", [id]);
};
export const getHotelByRoomid = (id) => {
  return fireRequest("hotelByRoomId", [id]);
};
export const dopostBook = (userId, roomId, hotelId, body) => {
  return fireRequest("postBook", [userId, roomId, hotelId], body);
};
export const changeRoomStatus = (roomid, status) => {
  return fireRequest("changeRoomStatus", [roomid], status);
};
