import React, { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import { useDispatch, connectAdvanced, useSelector } from "react-redux";
import Slider from "rc-slider";
import { Loading } from "../common/Loader";
import { DISTRICT_CHOICES } from "../../Common/constants";

import { getHotelList, getOptionlist } from "../../Redux/actions";
import HotelList from "./HotelList";
import ErrorComponent from "./ErrorComponent";
import "rc-slider/assets/index.css";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

function Hotel() {
    const dispatch = useDispatch();

    const checkinMin = stringFromDate(new Date());
    const checkoutMin = stringFromDate(
        new Date(+new Date() + 15 * 60 * 60 * 24 * 1000)
    );

    const [optionlist, setOptionlist] = useState(null);
    const [form, setForm] = useState(null);

    const state = useSelector((reduxState) => reduxState);
    const { getOptionlistBackend, getHotelDetails } = state;

    useEffect(() => {
        dispatch(getOptionlist()).then((res) => {
            if (res && res.data) {
                const options = res.data;

                const newOptions = {
                    category: [
                        "All",
                        ...Object.values(options[0]).map((el) => el.category),
                    ],
                    district: ["All", ...DISTRICT_CHOICES.map((el) => el.text)],
                    minimum: Math.max(
                        0,
                        Math.floor(options[1][0].minimum / 100) * 100
                    ),
                    maximum: Math.max(
                        0,
                        Math.ceil(options[1][0].maximum / 100) * 100
                    ),
                };

                const currentForm = getInitFilter(newOptions);

                setForm(currentForm);
                setOptionlist(newOptions);
                fetchUpdatedHotels(currentForm);
            }
        });
    }, []);

    function handleChange(e) {
        let { name, value } = e.target;

        if (name === "beds" && (value > 20 || value < 1)) return;
        if (["checkin", "checkout"].includes(name)) {
            value = stringFromDate(value);
        }
        setForm({ ...form, [name]: value });
    }

    function onSliderChange(price) {
        setForm({ ...form, minimum: price[0], maximum: price[1] });
    }
    
    function fetchUpdatedHotels(updatedForm) {
        localStorage.setItem("applied_filters", JSON.stringify(updatedForm));
        const formData = {
            ...updatedForm,
            category:
            updatedForm.category === "All" ? "" : updatedForm.category,
            district:
            updatedForm.district === "All" ? "" : updatedForm.district,
        };
        dispatch(getHotelList(formData));
    }
    
    function clearFilters() {
        localStorage.removeItem("applied_filters");
        const currentForm = getInitFilter(optionlist);
        setForm(currentForm);
        fetchUpdatedHotels(currentForm);
    }

    function stringFromDate(date) {
        const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;
        const offsetedDate = new Date(+date + timezoneOffset);
        return offsetedDate.toISOString().slice(0, -14);
    }

    function getInitFilter(options) {
        const prevFilters = JSON.parse(localStorage.getItem("applied_filters"));
        let currentForm = {
            checkin: checkinMin,
            checkout: checkoutMin,
            type: "hotel",
            beds: 1,
            category: options.category[0],
            district: options.district[0],
            minimum: options.minimum,
            maximum: options.maximum,
        };

        if (prevFilters) {
            currentForm.category = (options.category.includes(prevFilters.category))? prevFilters.category: currentForm.category;
            currentForm.district = (options.district.includes(prevFilters.district))? prevFilters.district: currentForm.district;
            currentForm.beds = (prevFilters.beds > 0 && prevFilters.beds <= 20)? prevFilters.beds: currentForm.beds;
            currentForm.minimum = (prevFilters.minimum >= options.minimum)? prevFilters.minimum: currentForm.minimum;
            currentForm.maximum = (prevFilters.maximum >= options.maximum)? prevFilters.maximum: currentForm.maximum;
            currentForm.checkin = (new Date(prevFilters.checkin) && new Date(prevFilters.checkin) > ( + new Date - 24 * 60 * 60 * 1000))? prevFilters.checkin: currentForm.checkin;
            currentForm.checkout = (new Date(prevFilters.checkout) && new Date(prevFilters.checkout) > new Date(prevFilters.checkin))? prevFilters.checkout: currentForm.checkout;
        }

        return currentForm;
    }

    if (
        getOptionlistBackend &&
        !getOptionlistBackend.isFetching &&
        (getOptionlistBackend.isError || !getOptionlistBackend.data)
    ) {
        return <ErrorComponent />;
    }

    if (
        !getOptionlistBackend ||
        getOptionlistBackend.isFetching ||
        !optionlist
    ) {
        return <Loading />;
    }

    return (
        <div>
            <div className="relative bg-gray-50 pb-20 px-4 sm:px-6 lg:pb-28 lg:px-8 mx-auto ">
                <div className="relative max-w-7xl mx-auto">
                    <div className="">
                        {/* <h2 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
                            Accomodation
                        </h2> */}
                        <p className="mt-3  text-xl leading-7 text-indigo-500 sm:mt-4">
                            Select an accomodation that fits your needs and your
                            budget
                        </p>
                    </div>
                </div>
                <br />
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="type">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    className="block appearance-none w-full bg-gray-300 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    name="category"
                                    id="category"
                                    onChange={handleChange}
                                    value={form.category}>
                                    {optionlist.category.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="district">
                                Location
                            </label>
                            <div className="relative">
                                <select
                                    className="block appearance-none w-full bg-gray-300 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    name="district"
                                    id="district"
                                    onChange={handleChange}
                                    value={form.district}>
                                    {optionlist.district.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/5 px-3 mb-6 md:mb-0">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="type">
                                No. of Beds
                            </label>
                            <div className="relative">
                                <div
                                    style={{ maxWidth: "10rem" }}
                                    className="custom-number-input h-10">
                                    <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1 hover:text-black text-gray-700">
                                        <button
                                            onClick={() =>
                                                handleChange({
                                                    target: {
                                                        name: "beds",
                                                        value: form.beds - 1,
                                                    },
                                                })
                                            }
                                            className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                                            <span className="m-auto text-2xl font-thin">
                                                −
                                            </span>
                                        </button>
                                        <input
                                            readOnly
                                            type="number"
                                            className="beds-count outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md focus:text-black  md:text-basecursor-default flex items-center   outline-none"
                                            name="custom-input-number"
                                            value={form.beds}></input>
                                        <button
                                            onClick={() =>
                                                handleChange({
                                                    target: {
                                                        name: "beds",
                                                        value: form.beds + 1,
                                                    },
                                                })
                                            }
                                            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer outline-none">
                                            <span className="m-auto text-2xl font-thin">
                                                +
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Price Rs. {form.minimum}-{form.maximum}
                            </label>
                            <div className="relative">
                                <Range
                                    className="pt-5"
                                    min={optionlist.minimum}
                                    max={optionlist.maximum}
                                    allowCross={false}
                                    value={[form.minimum, form.maximum]}
                                    onChange={onSliderChange}
                                    step={50}
                                />
                            </div>
                        </div>

                        <div
                            className="w-full md:w-1/3 px-3 mb-6 md:mb-0 pt-5">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Start Date
                            </label>
                            <div className="relative">
                                <DatePicker
                                    value={new Date(form.checkin)}
                                    onChange={(newdate) =>
                                        handleChange({
                                            target: {
                                                name: "checkin",
                                                value: newdate,
                                            },
                                        })
                                    }
                                    minDate={new Date()}
                                    maxDate={new Date(new Date(form.checkout) + 24 * 60 * 60 * 100)}
                                    clearIcon={null}
                                    format="y-MM-dd"
                                />
                            </div>
                        </div>
                        <div
                            className="w-full md:w-1/3 px-3 mb-6 md:mb-0 pt-5">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                End Date
                            </label>
                            <div className="relative">
                                <DatePicker
                                    value={new Date(form.checkout)}
                                    onChange={(newdate) =>
                                        handleChange({
                                            target: {
                                                name: "checkout",
                                                value: newdate,
                                            },
                                        })
                                    }
                                    minDate={new Date(form.checkin)}
                                    clearIcon={null}
                                    format="y-MM-dd"
                                />
                            </div>
                        </div>

                        <div
                            className="w-full md:w-1/3  px-3 mb-6 md:mb-0 pt-5">
                            <div
                                className="relative pt-12 flex justify-around">
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:outline-none"
                                    type="button">
                                    Clear
                                </button>
                                <button
                                    onClick={() => fetchUpdatedHotels(form)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:outline-none"
                                    type="button">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {!getHotelDetails || getHotelDetails.isFetching ? (
                    <Loading />
                ) : !getHotelDetails.data ? (
                    <ErrorComponent />
                ) : (
                    <HotelList
                        hotels={getHotelDetails.data}
                        filterdetails={form}
                    />
                )}
            </div>
        </div>
    );
}

export default Hotel;
