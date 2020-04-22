export const USER_TYPES = [
  { type: "customer", string: "Customer" },
  { type: "facilityowner", string: "Facility Owner" }
];

export const BOOKING_CHECKIN_STATUS = {
  PENDING: {type:"PENDING", string: "Pending", color: "orange-600"},
  CHECKEDIN: {type:"CHECKEDIN", string: "Checked In", color: "green-600"},
  CHECKEDOUT: {type:"CHECKEDOUT", string: "Checked Out", color: "gray-600"},
};
export const BOOKING_STATUS = {
  CANCELLED: {type:"CANCELLED", string: "Cancelled", color: "red-700"},
  BOOKED: {type:"BOOKED", string: "Booked", color: "green-600"},
}
  

export const DISTRICT_CHOICES = [
  { id: 1, text: "Thiruvananthapuram" },
  { id: 2, text: "Kollam" },
  { id: 3, text: "Pathanamthitta" },
  { id: 4, text: "Alappuzha" },
  { id: 5, text: "Kottayam" },
  { id: 6, text: "Idukki" },
  { id: 7, text: "Ernakulam" },
  { id: 8, text: "Thrissur" },
  { id: 9, text: "Palakkad" },
  { id: 10, text: "Malappuram" },
  { id: 11, text: "Kozhikode" },
  { id: 12, text: "Wayanad" },
  { id: 13, text: "Kannur" },
  { id: 14, text: "Kasaragod" }
];

export const HOTEL_STATUS = {
  ACTIVE: {type:"ACTIVE", string: "Active", color: "green-600"},
  NOT_AVAILABLE: {type:"NOT_AVAILABLE", string: "Not Available", color: "red-700"},
}

export const DEFAULT_IMAGE = {
  HOTEL: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=450&q=100",
  ROOM: "https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=350&q=80",
  USER:"https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg"

}