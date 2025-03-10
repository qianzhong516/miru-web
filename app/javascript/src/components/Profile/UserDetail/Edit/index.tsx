/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from "react";

import { Country, State, City } from "country-state-city";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useOutsideClick } from "helpers";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import profileApi from "apis/profile";
import Loader from "common/Loader/index";
import { MobileDetailsHeader } from "common/Mobile/MobileDetailsHeader";
import { useProfile } from "components/Profile/context/EntryContext";
import { useUserContext } from "context/UserContext";
import { teamsMapper } from "mapper/teams.mapper";

import MobileEditPage from "./MobileEditPage";
import StaticPage from "./StaticPage";
import { userSchema } from "./validationSchema";

dayjs.extend(utc);

const addressOptions = [
  { label: "Current", value: "current" },
  { label: "Permanent", value: "permanent" },
];

const schema = Yup.object().shape(userSchema);

const UserDetailsEdit = () => {
  const initialErrState = {
    first_name_err: "",
    last_name_err: "",
    address_line_1_err: "",
    country_err: "",
    state_err: "",
    city_err: "",
    email_id_err: "",
    pin_err: "",
  };

  const initialSelectValue = {
    label: "",
    value: "",
    code: "",
  };
  const { memberId } = useParams();

  const navigate = useNavigate();
  const { isDesktop } = useUserContext();

  const wrapperRef = useRef(null);

  const [currentCountryDetails, setCurrentCountryDetails] =
    useState(initialSelectValue);
  const [currentCityList, setCurrentCityList] = useState([]);
  const [addrType, setAddrType] = useState({ label: "", value: "" });
  const [showDatePicker, setShowDatePicker] = useState({ visibility: false });
  const [countries, setCountries] = useState([]);
  const [errDetails, setErrDetails] = useState(initialErrState);
  const [isLoading, setIsLoading] = useState(false);
  const [addrId, setAddrId] = useState();
  const [userId, setUserId] = useState();
  const { setUserState, profileSettings } = useProfile();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useOutsideClick(wrapperRef, () => setShowDatePicker({ visibility: false }));
  const assignCountries = async allCountries => {
    const countryData = await allCountries.map(country => ({
      value: country.name,
      label: country.name,
      code: country.isoCode,
    }));
    setCountries(countryData);
  };

  useEffect(() => {
    const currentCountry = Country.getAllCountries().filter(
      country =>
        country.name == profileSettings.addresses.country ||
        country.isoCode == profileSettings.addresses.country
    )[0];

    currentCountry &&
      setCurrentCountryDetails({
        label: currentCountry.name,
        value: currentCountry.name,
        code: currentCountry?.isoCode,
      });

    if (profileSettings.addresses.city) {
      const stateCode =
        currentCountry &&
        State.getStatesOfCountry(currentCountry?.isoCode).filter(
          state => state.name == profileSettings.addresses.state
        )[0]?.isoCode;

      setCurrentCityList(
        City.getCitiesOfState(
          currentCountry?.isoCode,
          stateCode ?? profileSettings.addresses.state
        ).map(city => ({
          label: city.name,
          value: city.name,
          ...city,
        }))
      );
    }
  }, [profileSettings]);

  const getDetails = async () => {
    const data = await profileApi.index();
    const addressData = await profileApi.getAddress(data.data.user.id);
    setUserId(data.data.user.id);

    const userObj = teamsMapper(data.data.user, addressData.data.addresses[0]);
    setUserState("profileSettings", userObj);
    if (userObj.addresses?.address_type?.length > 0) {
      setAddrType(
        addressOptions.find(
          item => item.value === userObj.addresses.address_type
        )
      );
    }
    setAddrId(addressData.data.addresses[0]?.id);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const allCountries = Country.getAllCountries();
    assignCountries(allCountries);
    getDetails();
  }, []);

  const cancelPasswordChange = () => {
    setChangePassword(false);
    setUserState("profileSettings", {
      ...profileSettings,
      ...{ confirmPassword: "", password: "", currentPassword: "" },
    });
  };

  const handleOnChangeCountry = selectCountry => {
    setCurrentCountryDetails(selectCountry);
    setUserState("profileSettings", {
      ...profileSettings,
      ...{
        addresses: {
          ...profileSettings.addresses,
          ...{ country: selectCountry.value, state: "", city: "" },
        },
      },
    });
  };

  const updatedStates = countryCode =>
    State.getStatesOfCountry(countryCode).map(state => ({
      label: state.name,
      value: state.name,
      code: state?.isoCode,
      ...state,
    }));

  const handleOnChangeAddrType = addreType => {
    setAddrType(addreType);
    setUserState("profileSettings", {
      ...profileSettings,
      ...{
        addresses: {
          ...profileSettings.addresses,
          ...{ address_type: addreType.value },
        },
      },
    });
  };

  const handleOnChangeState = selectState => {
    setUserState("profileSettings", {
      ...profileSettings,
      ...{
        addresses: {
          ...profileSettings.addresses,
          ...{ state: selectState.value, city: "" },
        },
      },
    });

    const cities = City.getCitiesOfState(
      currentCountryDetails.code,
      selectState.code
    ).map(city => ({ label: city.name, value: city.name, ...city }));
    setCurrentCityList(cities);
  };

  const filterCities = (inputValue: string) => {
    const city = currentCityList.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return city.length ? city : [{ label: inputValue, value: inputValue }];
  };

  const promiseOptions = (inputValue: string) =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(filterCities(inputValue));
      }, 1000);
    });

  const updateBasicDetails = (value, type, isAddress = false) => {
    if (isAddress) {
      setUserState("profileSettings", {
        ...profileSettings,
        ...{
          addresses: { ...profileSettings.addresses, ...{ [type]: value } },
        },
      });
    } else {
      setUserState("profileSettings", {
        ...profileSettings,
        ...{ [type]: value },
      });
    }
  };

  const handleDatePicker = date => {
    setShowDatePicker({ visibility: !showDatePicker.visibility });
    const formattedDate = dayjs(date, profileSettings.date_format).format(
      profileSettings.date_format
    );

    setUserState("profileSettings", {
      ...profileSettings,
      ...{ date_of_birth: formattedDate },
    });
  };

  const handleUpdateDetails = async () => {
    try {
      await schema.validate(
        {
          ...profileSettings,
          ...{
            is_email: profileSettings.email_id
              ? profileSettings.email_id.length > 0
              : false,
            changePassword,
          },
        },
        { abortEarly: false }
      );

      const userSchema = {
        first_name: profileSettings.first_name,
        last_name: profileSettings.last_name,
        date_of_birth: profileSettings.date_of_birth
          ? dayjs
              .utc(profileSettings.date_of_birth, profileSettings.date_format)
              .toISOString()
          : null,
        phone: profileSettings.phone_number
          ? profileSettings.phone_number
          : null,
        personal_email_id: profileSettings.email_id,
        social_accounts: {
          linkedin_url: profileSettings.linkedin,
          github_url: profileSettings.github,
        },
      };
      if (changePassword) {
        userSchema["current_password"] = profileSettings.currentPassword;
        userSchema["password"] = profileSettings.password;
        userSchema["password_confirmation"] = profileSettings.confirmPassword;
      }

      const payload = {
        address: {
          address_line_1: profileSettings.addresses.address_line_1,
          address_line_2: profileSettings.addresses.address_line_2,
          address_type: profileSettings.addresses.address_type,
          city: profileSettings.addresses.city,
          state: profileSettings.addresses.state,
          country: profileSettings.addresses.country,
          pin: profileSettings.addresses.pin,
        },
      };

      await profileApi.update({
        user: userSchema,
      });

      if (addrId) {
        await profileApi.updateAddress(userId, addrId, {
          address: { ...profileSettings.addresses },
        });
      } else {
        await profileApi.createAddress(userId, payload);
      }

      setErrDetails(initialErrState);
      navigate(`/profile/edit`, { replace: true });
    } catch (err) {
      setIsLoading(false);
      const errObj = initialErrState;
      if (err.inner) {
        err.inner.map(item => {
          if (item.path.includes("addresses")) {
            errObj[`${item.path.split(".").pop()}_err`] = item.message;
          } else {
            errObj[`${item.path}_err`] = item.message;
          }
        });
        setErrDetails(errObj);
      }
    }
  };

  const handleOnChangeCity = selectCity => {
    setUserState("profileSettings", {
      ...profileSettings,
      ...{
        addresses: {
          ...profileSettings.addresses,
          ...{ city: selectCity.value },
        },
      },
    });
  };

  const handlePhoneNumberChange = phoneNumber => {
    updateBasicDetails(phoneNumber, "phone_number", false);
  };

  const handleCancelDetails = () => {
    setIsLoading(true);
    navigate(`/profile/edit`, { replace: true });
  };

  const handleCurrentPasswordChange = event => {
    setCurrentPassword(event.target.value);
  };

  const getErr = errMsg => <p className="text-sm text-red-600">{errMsg}</p>;

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value);
  };

  return (
    <Fragment>
      {isDesktop && (
        <Fragment>
          <div className="flex items-center justify-between bg-miru-han-purple-1000 px-10 py-4">
            <h1 className="text-2xl font-bold text-white">Personal Details</h1>
            <div>
              <button
                className="mx-1 cursor-pointer rounded-md border border-white bg-miru-han-purple-1000 px-3 py-2 font-bold text-white	"
                onClick={handleCancelDetails} // eslint-disable-line  @typescript-eslint/no-empty-function
              >
                Cancel
              </button>
              <button
                className="mx-1 cursor-pointer rounded-md border bg-white px-3 py-2 font-bold text-miru-han-purple-1000"
                onClick={handleUpdateDetails}
              >
                Update
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="flex min-h-70v items-center justify-center">
              <Loader />
            </div>
          ) : (
            <StaticPage
              addrType={addrType}
              addressOptions={addressOptions}
              cancelPasswordChange={cancelPasswordChange}
              changePassword={changePassword}
              confirmPassword={confirmPassword}
              countries={countries}
              currentCityList={currentCityList}
              currentCountryDetails={currentCountryDetails}
              currentPassword={currentPassword}
              dateFormat={profileSettings.date_format}
              errDetails={errDetails}
              getErr={getErr}
              handleConfirmPasswordChange={handleConfirmPasswordChange}
              handleCurrentPasswordChange={handleCurrentPasswordChange}
              handleDatePicker={handleDatePicker}
              handleOnChangeAddrType={handleOnChangeAddrType}
              handleOnChangeCity={handleOnChangeCity}
              handleOnChangeCountry={handleOnChangeCountry}
              handleOnChangeState={handleOnChangeState}
              handlePasswordChange={handlePasswordChange}
              handlePhoneNumberChange={handlePhoneNumberChange}
              password={password}
              personalDetails={profileSettings}
              promiseOptions={promiseOptions}
              setChangePassword={setChangePassword}
              setErrDetails={setErrDetails}
              setShowConfirmPassword={setShowConfirmPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              setShowDatePicker={setShowDatePicker}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              showCurrentPassword={showCurrentPassword}
              showDatePicker={showDatePicker}
              showPassword={showPassword}
              updateBasicDetails={updateBasicDetails}
              updatedStates={updatedStates}
              wrapperRef={wrapperRef}
            />
          )}
        </Fragment>
      )}
      {!isDesktop && (
        <Fragment>
          <MobileDetailsHeader href="/profile/edit" title="Personal Details" />
          {isLoading ? (
            <div className="flex min-h-70v items-center justify-center">
              <Loader />
            </div>
          ) : (
            <MobileEditPage
              addrType={addrType}
              addressOptions={addressOptions}
              cancelPasswordChange={cancelPasswordChange}
              changePassword={changePassword}
              countries={countries}
              currentCountryDetails={currentCountryDetails}
              currentPassword={currentPassword}
              dateFormat={profileSettings.date_format}
              errDetails={errDetails}
              handleCancelDetails={handleCancelDetails}
              handleCurrentPasswordChange={handleCurrentPasswordChange}
              handleDatePicker={handleDatePicker}
              handleOnChangeAddrType={handleOnChangeAddrType}
              handleOnChangeCity={handleOnChangeCity}
              handleOnChangeCountry={handleOnChangeCountry}
              handleOnChangeState={handleOnChangeState}
              handlePhoneNumberChange={handlePhoneNumberChange}
              handleUpdateDetails={handleUpdateDetails}
              personalDetails={profileSettings}
              promiseOptions={promiseOptions}
              setChangePassword={setChangePassword}
              setErrDetails={setErrDetails}
              setShowConfirmPassword={setShowConfirmPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              setShowDatePicker={setShowDatePicker}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              showCurrentPassword={showCurrentPassword}
              showDatePicker={showDatePicker}
              showPassword={showPassword}
              updateBasicDetails={updateBasicDetails}
              updatedStates={updatedStates}
              wrapperRef={wrapperRef}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserDetailsEdit;
