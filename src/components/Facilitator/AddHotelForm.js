import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAddHotel } from "../../Redux/actions";
import * as Notficiation from "../../util/Notifications";
import { navigate } from "hookrouter";
import { phonePreg } from "../../util/validation";
import { DISTRICT_CHOICES } from "../../Common/constants";
import UploadImage from "./UploadImage";
import axios from "axios";

export default function AddHotelForm() {


  const dispatch = useDispatch();

  const state = useSelector(state => state);
  const { currentUser: temp } = state;
  const currentUser = temp.data.data;

  const initForm = {
    name: "",
    ownerID: currentUser.id,
    address: "",
    panchayath: "",
    district: DISTRICT_CHOICES[0].text,
    starCategory: "",
    latitude: "11.1",
    longitude: "2.1",
    facilities: "",
    file: [],
    contact: "",
    policy: "",
  };

  const optionalValues = ["panchayath"];

  const initError = {
    name: "",
    address: "",
    panchayath: "",
    district: "",
    starCategory: "",
    latitude: "11.1",
    longitude: "2.1",
    facilities: "",
    file: "",
    contact: "",
    policy: "",
  };
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(initForm);
  const [error, setError] = useState(initError);
  const [formError, setFormError] = useState(false);
  const [star, setStar] = useState("");
  const [checkbox, setCheckbox] = useState({
    pool: false,
    wifi: false,
    parking: false,
    cctv: false
  });



  const handleChange = (e) => {
    const { value, name } = e.target;
    const fieldValue = { ...form };

    // error handling needed

    fieldValue[name] = fieldValue[name] = value;

    setForm(fieldValue);
  };

  const handleCheckbox = (e) => {
    const { name } = e.target;
    const prevState = checkbox[name];
    const newState = { ...checkbox, [name]: !prevState };
    setCheckbox(newState);

    setForm({ ...form, facilities: Object.keys(newState).filter(el => newState[el]).join(",") });
  }

  function validInputs() {
    let formValid = true;
    let err = Object.assign({}, initError);
    const { contact } = form;


    Object.keys(form).forEach((key) => {
      if (form[key] === "" && !optionalValues.includes(key)) {
        formValid = false;
        err[key] = "This field is required";
      }
    });

    if (!phonePreg(contact)) {
      formValid = false;
      err["contact"] = "Enter Valid phone number"
    };


    setError(err);
    return formValid;
  }

  const setFiles = (files) => {
    setForm({ ...form, file: files });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(validInputs(), "hey", formLoading);
    
    if (validInputs() && !formLoading) {
      const formData = new FormData()
  
      Object.keys(form).forEach(key => {
        if (key === "file"){
          form[key].forEach(el => {
            formData.append(key, el);  
          });
        } else {
          formData.append(key, form[key]);  
        } 
      });
      setFormLoading(true);
      /**********************************************
       * 
       *  NOT USING FIREREQUEST FOR THE TIME BEING 
       * 
       **********************************************/
      // dispatch(postAddHotel(formData)).then((resp) => {
      //   const { status: statusCode } = resp;
      //   const { data: res } = resp;

      //   // set captha logic needed
      //   if (res && statusCode === 201) {
      //     Notficiation.Success({
      //       msg: "Hotel Created, Add Room Details",
      //     });
      //     navigate(`${res.id}/room/add `);

      //   } else {
      //     setFormError("Some problem occurred");
      //     setFormLoading(false);
      //   }
      // });

      const URL = "https://api.stay.coronasafe.in/api/v1/facility/add-facility";
      const token = localStorage.getItem("stay_access_token");
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
        }
      }

      axios.post(URL, formData, config).then(res => {
        console.log("This request was a success");
        console.log(res);
        Notficiation.Success({
          msg: "Hotel Created, Add Room Details",
        });
        navigate(`${res.id}/room/add `);
      }).catch(err => {
        console.log(err);
        setFormError("Some problem occurred");
        setFormLoading(false);
      })
    }
  };

  return (

    // className="p-3 bg-indigo-400 text-white w-full hover:bg-indigo-300"    
    <div className="h-full  overflow-x-hidden flex items-center justify-center bg-gray-400 ">
      <div className="leading-loose">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl  m-4 p-10 bg-white rounded shadow-xl"
        >
          <p className="text-gray-800 font-medium text-center">
            Hotel information
          </p>
          <div className="mt-2">
            <label className="block text-sm text-gray-600" htmlFor="name">
              Hotel Name
            </label>
            <input
              className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              id="hotel-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              required=""
              placeholder="Enter Hotel Name"
              aria-label="Name"
            />
            <div className="text-xs italic text-red-500">{error.name}</div>
          </div>
          <div className="mt-2">
            <label className="block text-sm text-gray-600" htmlFor="address">
              Address
            </label>
            <textarea
              className="form-textarea w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              type="text"
              required=""
              placeholder="Enter Hotel Address"
              aria-label="Name"
            />
            <div className="text-xs italic full-width text-red-500">{error.address}</div>

          </div>
          <div className="w-full md:w-1/2 inline-block mt-2 pr-1">
            <label
              className="block text-sm text-gray-600 "
              htmlFor="panchayath"
            >
              Panchayath
            </label>
            <input
              className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              id="panchayath"
              name="panchayath"
              value={form.panchayath}
              onChange={handleChange}
              type="text"
              required=""
              placeholder="Enter Panchayat"
              aria-label="Name"
            />

          </div>
          <div className="w-full md:w-1/2 inline-block mt-2 -mx-1 pl-1">
            <label className="block text-sm text-gray-600" htmlFor="district">
              District
            </label>
            <div className="relative">
              <select className="appearance-none w-full py-1 px-5 py-1 text-gray-700 bg-gray-200 rounded"
                name="district"
                value={form.district}
                onChange={handleChange}
                aria-label="Enter District"
              >
                {
                  DISTRICT_CHOICES.map(el => (
                    <option value={el.text} key={el.text}>{el.text}</option>
                  ))

                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label
              className="block text-sm text-gray-600 "
              htmlFor="starCategory"
            >
              Star Category
            </label>

            <div className="mt-2 bg-gray-200 flex justify-center flex-wrap">
              <label className="inline-flex items-center mx-3">
                <input
                  type="radio"
                  className="form-radio h-3 w-3"
                  name="starCategory"
                  checked={star === "1"}
                  value="1"
                  onChange={handleChange}
                  onClick={() => setStar("1")}
                />
                <span className="text-gray-600 ml-2">1 star</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  type="radio"
                  className="form-radio h-3 w-3"
                  name="starCategory"
                  checked={star === "2"}
                  value="2"
                  onChange={handleChange}
                  onClick={() => setStar("2")}
                />
                <span className="ml-2 text-gray-600">2 star</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  type="radio"
                  className="form-radio h-3 w-3"
                  name="starCategory"
                  checked={star === "3"}
                  value="3"
                  onChange={handleChange}
                  onClick={() => setStar("3")}
                />
                <span className="ml-2 text-gray-600">3 star</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  type="radio"
                  className="form-radio h-3 w-3"
                  name="starCategory"
                  checked={star === "4"}
                  value="4"
                  onChange={handleChange}
                  onClick={() => setStar("4")}
                />
                <span className="ml-2 text-gray-600">4 star</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  type="radio"
                  className="form-radio h-3 w-3"
                  name="starCategory"
                  checked={star === "5"}
                  value="5"
                  onChange={handleChange}
                  onClick={() => setStar("5")}
                />
                <span className="ml-1 text-gray-600">5 star</span>
              </label>
            </div>
            <div className="text-xs italic full-width text-red-500">{error.starCategory}</div>
          </div>

          <div className="mt-2">
            <label
              className="block text-sm text-gray-600 "
              htmlFor="starCategory"
            >
              Hotel Features
            </label>

            <div className="mt-2 bg-gray-200 flex flex-wrap sm:justify-around justify-center">
              <label className="inline-flex items-center mx-3">
                <input
                  id="pool"
                  type="checkbox"
                  name="pool"
                  checked={checkbox.pool}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  onChange={handleCheckbox}
                />
                <span className="ml-1 text-gray-600">Pool</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  id="wifi"
                  type="checkbox"
                  name="wifi"
                  checked={checkbox.wifi}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  onChange={handleCheckbox}
                />
                <span className="ml-1 text-gray-600">Wifi</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  id="CCTV"
                  type="checkbox"
                  name="cctv"
                  checked={checkbox.cctv}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  onChange={handleCheckbox}
                />
                <span className="ml-1 text-gray-600">CCTV</span>
              </label>
              <label className="inline-flex items-center mx-3">
                <input
                  id="parking"
                  type="checkbox"
                  name="parking"
                  checked={checkbox.parking}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  onChange={handleCheckbox}
                />
                <span className="ml-1 text-gray-600">Parking</span>
              </label>
            </div>
            <div className="text-xs italic full-width text-red-500">{error.facilities}</div>
          </div>


          {/* File upload */}
          <div className="mt-2">
            <label className="block text-sm text-gray-600 " htmlFor="photos">
              Upload photos (maximum 5)
            </label>

            <UploadImage setFiles={setFiles} formLoading={formLoading} />
          </div>
          <div className="mt-2">
            <label className="block text-sm text-gray-600" htmlFor="contact">
              Contact Number
            </label>
            <input
              className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              type="text"
              required=""
              placeholder="Enter Contact Number"
              aria-label="Name"
            />
            <div className="text-xs italic text-red-500">{error.contact}</div>

          </div>

          <div className="mt-2">
            <label className="block text-sm text-gray-600" htmlFor="policy">
              Policy
            </label>
            <textarea
              className="form-textarea w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
              id="policy"
              name="policy"
              value={form.policy}
              onChange={handleChange}
              type="text"
              required=""
              placeholder="Enter Hotel Policies"
              aria-label="Name"
            />
            <div className="text-xs italic full-width text-red-500">{error.policy}</div>
          </div>
          <div className="h-10">
            <p className="text-red-500 text-xs italic bold text-center mt-2">
              {formError}
            </p>
          </div>

          <div className="mt-2 flex items-center">
            <button
                className={`px-4 py-1 text-white font-bold tracking-wider ${formLoading ? "bg-gray-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-800"} rounded`}
              type="submit"
            >
              Submit
            </button>
            {
              formLoading && <div className="ml-3 text-gray-700 text-sm">Uploading images and submitting data...</div>
            }
          </div>
        </form>
      </div>
    </div>
  );
}