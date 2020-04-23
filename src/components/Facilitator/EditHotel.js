import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateHotel, getUserHotelList } from "../../Redux/actions";
import * as Notficiation from "../../util/Notifications";
import { navigate, A } from "hookrouter";
import { phonePreg } from "../../util/validation";
import { DISTRICT_CHOICES } from "../../Common/constants";

export default function EditHotel({ id }) {

    const dispatch = useDispatch();

    const state = useSelector(state => state);
    const { currentUser: temp } = state;
    const currentUser = temp && temp.data && temp.data.data;
    const { userHotelList } = state;

    const initForm = {
        name: "",
        address: "",
        panchayath: "",
        district: "",
        starCategory: "",
        latitude: "11.1",
        longitude: "2.1",
        facilities: "",
        photos: "photo",
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
        latitude: "",
        longitude: "",
        facilities: "",
        photos: "",
        contact: "",
        policy: "",
    };

    const initFacilities = {
        parking: false,
        wifi: false,
        pool: false,
        cctv: false
    };

    const [formLoading, setFormLoading] = useState(false);
    const [form, setForm] = useState(initForm);
    const [error, setError] = useState(initError);
    const [formError, setFormError] = useState(false);
    const [star, setStar] = useState("");
    const [checkbox, setCheckbox] = useState(initFacilities);

    useEffect(() => {
        dispatch(getUserHotelList()).then(res => {
            if (res && res.data && res.status === 200 && res.data.data) {
                const currentHotel = Object.values(res.data.data).find(el => el.id === id);
                if (currentHotel) {
                    let currentForm = Object.assign({}, initForm);
                    Object.keys(currentForm).forEach(el => {
                        currentForm[el] = currentHotel[el];
                    });
                    let currentFacilities = Object.assign({}, initFacilities);
                    currentHotel.facilities.split(",").forEach(el => {
                        currentFacilities[el] = true;
                    });
                    setForm(currentForm);
                    setCheckbox(currentFacilities);
                    setStar(currentHotel.starCategory);
                }
            }
        });
    }, [dispatch, currentUser.id]);

    function handleChange(e) {
        const { value, name } = e.target;
        const fieldValue = { ...form };

        fieldValue[name] = value;

        setForm(fieldValue);
    }

    function handleCheckbox(e) {
        const { name } = e.target;
        const prevState = checkbox[name];
        const newState = { ...checkbox, [name]: !prevState };
        setCheckbox(newState);
        setForm({ ...form, facilities: Object.keys(checkbox).filter(el => newState[el]).join(",") });
    };

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

    function handleSubmit(e) {
        e.preventDefault();

        let submitData = {};
        Object.keys(form).forEach(el => {
            if (form[el] !== currentHotel[el]) {
                submitData[el] = form[el];
            }
        });

        if (validInputs() && !formLoading) {
            setFormLoading(true);
            dispatch(updateHotel([id, "update-Facility"], submitData)).then((resp) => {
                const { status: statusCode } = resp;
                const { data: res } = resp;

                // set captha logic needed
                if (res && statusCode === 200 && res.success === true) {
                    Notficiation.Success({
                        msg: "Hotel Updated",
                    });
                    navigate(`/hotel/${id}`);
                }

                let formErr = "Some problem occurred";
                // error exists show error
                if (res && res.success === false && res.data) {
                    formErr = Object.values(res.data)[0];
                }
                const errorMessages = resp.response ? resp.response.data ? resp.response.data.message : null : null;
                if (errorMessages) {
                    let err = initError;
                    errorMessages.forEach((msgObj) => {
                        err[msgObj.property] = Object.values(
                            msgObj.constraints
                        ).map((val, i) => <p key={i.toString()}>{val}</p>);
                    });
                    setError(err);
                }
                setFormError(formErr);
                setFormLoading(false);
            }).catch(err => {
                console.log(err);
                Notficiation.Error({
                    msg: "Something went wrong, please try again"
                });
            })
        }
    }

    if (!userHotelList || userHotelList.isFetching) {
        return <div className="lds-dual-ring h-screen w-screen items-center justify-center overflow-hidden flex"></div>
    }
    if (userHotelList.error) {
        return (
            <div className="h-screen w-full items-center flex flex-col justify-center overflow-hidden">
                <div className="text-5xl text-gray-400">Some problem occured, please try again</div>
            </div>
        );
    }

    const currentHotel = userHotelList.data && userHotelList.data.data && Object.values(userHotelList.data.data).find(el => el.id === id);

    // check if the hotel actually exists
    // and if this user is the owner
    if (!currentHotel || (currentHotel.ownerID !== currentUser.id)) {
        return (
            <div className="h-screen w-full items-center flex flex-col justify-center overflow-hidden">
                <div className="text-5xl text-gray-400">Hotel was not found</div>
                <A href="/" className="flex items-center text-xl m-5 py-3 px-8 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 sm:px-3 rounded focus:outline-none focus:shadow-outline">
                    Home
                </A>
            </div>
        );
    }

    return (
        <div className="overflow-x-hidden flex items-center justify-center">
            <div className="leading-loose">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl  m-4 p-10 bg-white rounded shadow-xl"
                >
                    <p className="text-gray-800 font-medium text-center">
                        Edit Hotel
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
                    <div className="inline-block mt-2 pr-1">
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
                            placeholder="Enter Panchayath"
                            aria-label="Name"
                        />
                        <div className="text-xs italic text-red-500 h-3">{error.panchayath}</div>
                    </div>
                    <div className="inline-block mt-2 pl-1">
                        <label className="block text-sm text-gray-600" htmlFor="district">
                            District
                        </label>
                        <select className="w-full py-3 px-5 py-1 text-gray-700 bg-gray-200 rounded"
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
                        <div className="text-xs italic text-red-500 h-3">{error.district}</div>
                    </div>

                    <div className="mt-2">
                        <label
                            className="block text-sm text-gray-600 "
                            htmlFor="starCategory"
                        >
                            Star Category
            </label>

                        <div className="mt-2 bg-gray-200">
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    className="form-radio h-3 w-3"
                                    name="starCategory"
                                    checked={star === "1"}
                                    value="1"
                                    onChange={handleChange}
                                    onClick={() => setStar("1")}
                                />
                                <span className="ml-2 text-gray-600">1 star</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    className="form-radio h-3 w-3"
                                    name="starCategory"
                                    checked={star === "2"}
                                    value="2"
                                    onChange={handleChange}
                                    onClick={() => setStar("2")}
                                />
                                <span className="ml-2  text-gray-600">2 star</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    className="form-radio h-3 w-3"
                                    name="starCategory"
                                    checked={star === "3"}
                                    value="3"
                                    onChange={handleChange}
                                    onClick={() => setStar("3")}
                                />
                                <span className="ml-2  text-gray-600">3 star</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    className="form-radio h-3 w-3"
                                    name="starCategory"
                                    checked={star === "4"}
                                    value="4"
                                    onChange={handleChange}
                                    onClick={() => setStar("4")}
                                />
                                <span className="ml-2  text-gray-600">4 star</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    className="form-radio h-3 w-3"
                                    name="starCategory"
                                    checked={star === "5"}
                                    value="5"
                                    onChange={handleChange}
                                    onClick={() => setStar("5")}
                                />
                                <span className="ml-2  text-gray-600">5 star</span>
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

                        <div className="mt-2 bg-gray-200">
                            <label className="inline-flex items-center ml-6">
                                <input
                                    id="pool"
                                    type="checkbox"
                                    name="pool"
                                    checked={checkbox.pool}
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    onChange={handleCheckbox}
                                />
                                <span className="ml-2 text-gray-600">Pool</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    id="wifi"
                                    type="checkbox"
                                    name="wifi"
                                    checked={checkbox.wifi}
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    onChange={handleCheckbox}
                                />
                                <span className="ml-2  text-gray-600">Wifi</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    id="CCTV"
                                    type="checkbox"
                                    name="cctv"
                                    checked={checkbox.cctv}
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    onChange={handleCheckbox}
                                />
                                <span className="ml-2  text-gray-600">CCTV</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    id="parking"
                                    type="checkbox"
                                    name="parking"
                                    checked={checkbox.parking}
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    onChange={handleCheckbox}
                                />
                                <span className="ml-2  text-gray-600">Parking</span>
                            </label>
                        </div>
                        <div className="text-xs italic full-width text-red-500">{error.starCategory}</div>
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
                        <div className="text-xs italic text-red-500 h-3">{error.policy}</div>
                    </div>
                    <div className="h-10">
                        <p className="text-red-500 text-xs italic bold text-center mt-2">
                            {formError}
                        </p>
                    </div>

                    <div className="mt-2">
                        <button
                            className={`px-4 py-1 text-white w-full tracking-wider ${formLoading ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-800"} rounded`}
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}