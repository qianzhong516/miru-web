import React from "react";

import dayjs from "dayjs";
import {
  CalendarIcon,
  GlobeIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
} from "miruIcons";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

import { CustomAsyncSelect } from "common/CustomAsyncSelect";
import CustomDatePicker from "common/CustomDatePicker";
import { CustomInputText } from "common/CustomInputText";
import { CustomReactSelect } from "common/CustomReactSelect";
import { Divider } from "common/Divider";
import { ErrorSpan } from "common/ErrorSpan";

const inputClass =
  "form__input block w-full appearance-none bg-white p-4 text-sm h-12 focus-within:border-miru-han-purple-1000";

const labelClass =
  "absolute top-0.5 left-1 h-6 z-1 origin-0 bg-white p-2 text-sm font-medium duration-300";

const MobileEditDetails = ({
  addrType,
  addressOptions,
  countries,
  handleOnChangeAddrType,
  handleOnChangeCountry,
  handleCancelDetails,
  handleUpdateDetails,
  currentCountryDetails,
  updatedStates,
  promiseOptions,
  handleOnChangeState,
  updateBasicDetails,
  personalDetails,
  showDatePicker,
  setShowDatePicker,
  handleDatePicker,
  errDetails,
  handleOnChangeCity,
  handlePhoneNumberChange,
  wrapperRef,
  dateFormat,
}) => (
  <div className="mt-12 px-4 py-2">
    <div className="py-4">
      <span className="flex flex-row items-center px-1 text-sm font-medium text-miru-dark-purple-1000">
        <InfoIcon className="mr-2" color="#1D1A31" size={13.5} /> Basic Details
      </span>
      <div className="mt-2 flex w-full flex-row">
        <div className="w-1/2 px-1">
          <CustomInputText
            id="first_name"
            label="First name"
            name="first_name"
            type="text"
            value={personalDetails.first_name}
            inputBoxClassName={`${inputClass} ${
              errDetails.first_name_err
                ? "border-red-600"
                : "border-miru-gray-1000"
            }`}
            labelClassName={`${labelClass} ${
              errDetails.first_name_err
                ? "text-red-600"
                : "text-miru-dark-purple-200"
            }`}
            onChange={e => {
              updateBasicDetails(e.target.value, "first_name", false, "");
            }}
          />
          {errDetails.first_name_err && (
            <ErrorSpan
              className="text-xs text-red-600"
              message={errDetails.first_name_err}
            />
          )}
        </div>
        <div className="w-1/2 px-1">
          <CustomInputText
            id="last_name"
            label="Last name"
            name="last_name"
            type="text"
            value={personalDetails.last_name}
            inputBoxClassName={`${inputClass} ${
              errDetails.last_name_err
                ? "border-red-600"
                : "border-miru-gray-1000"
            }`}
            labelClassName={`${labelClass} ${
              errDetails.last_name_err
                ? "text-red-600"
                : "text-miru-dark-purple-200"
            }`}
            onChange={e => {
              updateBasicDetails(e.target.value, "last_name", false, "");
            }}
          />
          {errDetails.last_name_err && (
            <ErrorSpan
              className="text-xs text-red-600"
              message={errDetails.last_name_err}
            />
          )}
        </div>
      </div>
      <div className="mt-2 flex w-full flex-row">
        <div className="flex w-1/2 flex-col py-3" ref={wrapperRef}>
          <div
            className="field relative flex w-full flex-col px-2"
            onClick={() =>
              setShowDatePicker({ visibility: !showDatePicker.visibility })
            }
          >
            <CustomInputText
              disabled
              id="date_of_birth"
              inputBoxClassName={`${inputClass} border-miru-gray-1000`}
              label="Date of Birth"
              name="date_of_birth"
              type="text"
              value={personalDetails.date_of_birth || ""}
              onChange={e => {
                updateBasicDetails(e.target.value, "date_of_birth", false);
              }}
            />
            <CalendarIcon
              className="absolute top-0 bottom-0 right-1 mx-2 my-3 "
              color="#5B34EA"
              size={20}
            />
          </div>
          {showDatePicker.visibility && (
            <CustomDatePicker
              dateFormat={dateFormat}
              handleChange={e => handleDatePicker(e, true)}
              date={
                personalDetails.date_of_birth
                  ? personalDetails.date_of_birth
                  : dayjs()
              }
            />
          )}
        </div>
      </div>
    </div>
    <Divider />
    <div className="py-4">
      <span className="flex flex-row items-center px-1 text-sm font-medium text-miru-dark-purple-1000">
        <PhoneIcon className="mr-2" color="#1D1A31" size={13.5} /> Contact
        Details
      </span>
      <div className="mt-2 flex w-full flex-row">
        <div className="w-1/2 px-1">
          <div className="outline relative flex h-12 flex-row rounded border border-miru-gray-1000 bg-white px-2 py-4 text-sm">
            <PhoneInput
              className="input-phone-number w-full border-transparent focus:border-transparent focus:ring-0"
              flags={flags}
              inputClassName="form__input block w-full appearance-none bg-white border-0 focus:border-0 p-0 text-sm border-transparent focus:border-transparent focus:ring-0 border-miru-gray-1000 w-full border-bottom-none "
              value={
                personalDetails.phone_number ? personalDetails.phone_number : ""
              }
              onChange={handlePhoneNumberChange}
            />
            <label
              className="absolute -top-1 left-0 z-1 ml-3 origin-0 bg-white px-1 text-xsm font-medium text-miru-dark-purple-200 duration-300"
              htmlFor="phone_number"
            >
              Phone number
            </label>
          </div>
        </div>
        <div className="w-1/2 px-1">
          <CustomInputText
            id="email_id"
            label="Email ID (Personal)"
            name="email_id"
            type="email"
            value={personalDetails.email_id}
            inputBoxClassName={`${inputClass} ${
              errDetails.email_id_err
                ? "border-red-600"
                : "border-miru-gray-1000"
            }`}
            labelClassName={`${labelClass} ${
              errDetails.email_id_err
                ? "text-red-600"
                : "text-miru-dark-purple-200"
            } `}
            onChange={e => {
              updateBasicDetails(e.target.value, "email_id", false);
            }}
          />
          {errDetails.email_id_err && (
            <ErrorSpan
              className="text-xs text-red-600"
              message={errDetails.email_id_err}
            />
          )}
        </div>
      </div>
    </div>
    <Divider />
    <div className="py-4">
      <span className="flex flex-row items-center px-1 text-sm font-medium text-miru-dark-purple-1000">
        <MapPinIcon className="mr-2" color="#1D1A31" size={13.5} /> Address
      </span>
      <div className="mt-2 flex w-full flex-col">
        <div className="px-1 py-1">
          <CustomReactSelect
            handleOnChange={handleOnChangeAddrType}
            label="Address type"
            name="address_select"
            options={addressOptions}
            value={addrType.value ? addrType : addressOptions[0]}
          />
        </div>
        <div className="px-1 py-1">
          <CustomInputText
            id="address_line_1"
            label="Address line 1"
            name="address_line_1"
            type="text"
            inputBoxClassName={`${inputClass} ${
              errDetails.address_line_1_err
                ? "border-red-600"
                : "border-miru-gray-1000"
            }`}
            labelClassName={`${labelClass} ${
              errDetails.address_line_1_err
                ? "text-red-600"
                : "text-miru-dark-purple-200"
            }`}
            value={
              personalDetails.addresses &&
              personalDetails.addresses.address_line_1
            }
            onChange={e => {
              updateBasicDetails(e.target.value, "address_line_1", true);
            }}
          />
          {errDetails.address_line_1_err && (
            <ErrorSpan
              className="text-xs text-red-600"
              message={errDetails.address_line_1_err}
            />
          )}
        </div>
        <div className="px-2 py-1">
          <CustomInputText
            id="address_line_2"
            inputBoxClassName={`${inputClass} border-miru-gray-1000`}
            label="Address line 2 (optional)"
            labelClassName={`${labelClass} text-miru-dark-purple-200`}
            name="address_line_2"
            type="text"
            value={
              personalDetails.addresses &&
              personalDetails.addresses.address_line_2
            }
            onChange={e => {
              updateBasicDetails(e.target.value, "address_line_2", true);
            }}
          />
        </div>
        <div className="flex flex-row">
          <div className="flex w-1/2 flex-col px-2 py-3">
            <CustomReactSelect
              handleOnChange={value => handleOnChangeCountry(value)}
              isErr={!!errDetails.country_err}
              label="Country"
              name="current_country_select"
              options={countries}
              value={{
                label: personalDetails.addresses.country,
                value: personalDetails.addresses.country,
              }}
            />
            {errDetails.country_err && (
              <ErrorSpan
                className="text-xs text-red-600"
                message={errDetails.country_err}
              />
            )}
          </div>
          <div className="flex w-1/2 flex-col px-2 py-3">
            <CustomReactSelect
              handleOnChange={state => handleOnChangeState(state)}
              isErr={!!errDetails.state_err}
              label="State"
              name="state_select"
              options={updatedStates(
                currentCountryDetails.code ? currentCountryDetails.code : null
              )}
              value={
                personalDetails.addresses.state
                  ? {
                      label: personalDetails.addresses.state,
                      value: personalDetails.addresses.state,
                    }
                  : null
              }
            />
            {errDetails.state_err && (
              <ErrorSpan
                className="text-xs text-red-600"
                message={errDetails.state_err}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex w-1/2 flex-col px-2 py-3">
            <CustomAsyncSelect
              handleOnChange={city => handleOnChangeCity(city)}
              isErr={!!errDetails.city_err}
              label="City"
              loadOptions={promiseOptions}
              name="country_select"
              value={{
                label: personalDetails.addresses.city,
                value: personalDetails.addresses.city,
              }}
            />
            {errDetails.city_err && (
              <ErrorSpan
                className="text-xs text-red-600"
                message={errDetails.city_err}
              />
            )}
          </div>
          <div className="flex w-1/2 flex-col px-2 py-3">
            <CustomInputText
              id="zipcode"
              label="Zipcode"
              name="zipcode"
              type="text"
              value={personalDetails.addresses.pin}
              inputBoxClassName={`${inputClass} ${
                errDetails.pin_err ? "border-red-600" : "border-miru-gray-1000"
              }`}
              labelClassName={`${labelClass} ${
                errDetails.pin_err
                  ? "text-red-600"
                  : "text-miru-dark-purple-200"
              }`}
              onChange={e => {
                updateBasicDetails(e.target.value, "pin", true);
              }}
            />
            {errDetails.pin_err && (
              <ErrorSpan
                className="text-xs text-red-600"
                message={errDetails.pin_err}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    <Divider />
    <div className="py-4">
      <span className="flex flex-row items-center px-1 text-sm font-medium text-miru-dark-purple-1000">
        <GlobeIcon className="mr-2" color="#1D1A31" size={13.5} />
        Social Profiles
      </span>
      <div className="mt-2 flex w-full flex-row">
        <div className="flex w-1/2 flex-col px-1">
          <CustomInputText
            id="linked_in"
            inputBoxClassName={`${inputClass} border-miru-gray-1000`}
            label="LinkedIn"
            labelClassName={`${labelClass} text-miru-dark-purple-200`}
            name="linked_in"
            type="text"
            value={personalDetails.linkedin}
            onChange={e => {
              updateBasicDetails(e.target.value, "linkedin", false, "");
            }}
          />
        </div>
        <div className="flex w-1/2 flex-col px-1">
          <CustomInputText
            id="github"
            inputBoxClassName={`${inputClass} border-miru-gray-1000`}
            label="github"
            labelClassName={`${labelClass} text-miru-dark-purple-200`}
            name="github"
            type="text"
            value={personalDetails.github}
            onChange={e => {
              updateBasicDetails(e.target.value, "github", false, "");
            }}
          />
        </div>
      </div>
    </div>
    <Divider />
    <div className="flex flex-row justify-between py-4">
      <button
        className="h-10	 w-38 rounded border border-miru-han-purple-1000 bg-transparent py-2 px-6 text-xs font-bold tracking-widest text-miru-han-purple-600 "
        onClick={handleCancelDetails}
      >
        CANCEL
      </button>
      <button
        className="h-10 w-38 rounded border border-miru-han-purple-1000 bg-miru-han-purple-1000 py-2 px-6 text-xs font-bold tracking-widest text-white"
        onClick={handleUpdateDetails}
      >
        SAVE
      </button>
    </div>
  </div>
);

export default MobileEditDetails;
