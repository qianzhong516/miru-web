import React, { useCallback, useEffect, useState } from "react";

import { Country, State, City } from "country-state-city";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Toastr } from "StyledComponents";
import * as Yup from "yup";

import companiesApi from "apis/companies";
import companyProfileApi from "apis/companyProfile";
import Loader from "common/Loader/index";
import { currencyList } from "constants/currencyList";
import { sendGAPageView } from "utils/googleAnalytics";

import { StaticPage } from "./StaticPage";

import Header from "../../Header";

const phoneRegExp =
  /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const orgSchema = Yup.object().shape({
  companyName: Yup.string()
    .required("Name cannot be blank")
    .max(30, "Maximum 30 characters are allowed"),
  companyPhone: Yup.string()
    .required("Phone number cannot be blank")
    .matches(phoneRegExp, "Please enter a valid business phone number"),
  companyAddr: Yup.object().shape({
    addressLine1: Yup.string()
      .required("Address Line 1 cannot be blank")
      .max(50, "Maximum 50 characters are allowed"),
    addressLine2: Yup.string().max(50, "Maximum 50 characters are allowed"),
    country: Yup.string().required("Country cannot be blank"),
    state: Yup.string().required("State cannot be blank"),
    city: Yup.string().required("City cannot be blank"),
    zipcode: Yup.string()
      .required("Zipcode cannot be blank")
      .max(10, "Maximum 10 characters are allowed"),
  }),
  companyRate: Yup.number()
    .typeError("Amount must be a number")
    .min(0, "please enter larger amount")
    .required("Rate cannot be blank"),
});

const fiscalYearOptions = [
  {
    label: "December",
    value: "Dec",
  },
  {
    label: "March",
    value: "Mar",
  },
  {
    label: "September",
    value: "Sep",
  },
];

const dateFormatOptions = [
  { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
  { value: "MM-DD-YYYY", label: "MM-DD-YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const initialState = {
  id: null,
  logoUrl: "",
  companyName: "",
  companyAddr: {
    id: null,
    addressLine1: "",
    addressLine2: "",
    city: {
      label: "",
      value: "",
    },
    country: {
      label: "",
      value: "",
      code: "",
    },
    state: {
      label: "",
      value: "",
      code: "",
    },
    zipcode: "",
  },
  companyPhone: "",
  countryName: "",
  companyCurrency: "",
  companyRate: "0.00",
  companyFiscalYear: "",
  companyDateFormat: "",
  companyTimezone: "",
  logo: null,
};

const errorState = {
  companyNameErr: "",
  companyPhoneErr: "",
  companyRateErr: "",
  addressLine1Err: "",
  addressLine2Err: "",
  stateErr: "",
  countryErr: "",
  cityErr: "",
  zipcodeErr: "",
};

const OrgEdit = () => {
  const navigate = useNavigate();
  const [orgDetails, setOrgDetails] = useState(initialState);

  const [errDetails, setErrDetails] = useState(errorState);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        "image/png": [".png", ".jpg", ".svg"],
      },
      maxSize: 1048576,
      multiple: false,
    });

  const file = acceptedFiles[0];

  useEffect(() => {
    if (file) {
      setOrgDetails({
        ...orgDetails,
        logoUrl: URL.createObjectURL(file),
        logo: file,
      });
      setIsDetailUpdated(true);
    }
  }, [file]);

  const [currenciesOption, setCurrenciesOption] = useState([]);
  const [timezoneOption, setTimezoneOption] = useState([]);
  const [timezones, setTimezones] = useState({});
  const [isDetailUpdated, setIsDetailUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [stateList, setStateList] = useState([]);
  const [currentCityList, setCurrentCityList] = useState([]);
  const initialSelectValue = {
    label: "",
    value: "",
    code: "",
  };
  const [countries, setCountries] = useState([]);
  const [currentCountryDetails, setCurrentCountryDetails] =
    useState(initialSelectValue);

  const getCurrencies = async () => {
    const currencies = currencyList.map(item => ({
      value: item.code,
      label: `${item.name} (${item.symbol})`,
    }));
    setCurrenciesOption(currencies);
  };

  const getData = async () => {
    setIsLoading(true);
    const res = await companiesApi.index();
    const companyDetails = { ...res.data.company_details };

    const {
      id,
      address_line_1: addressLine1,
      address_line_2: addressLine2,
      city,
      state,
      pin,
      country,
    } = companyDetails.address;

    let isoCode = "";
    let name = "";
    if (country && country !== "") {
      const countryData = Country.getCountryByCode(country);
      isoCode = countryData ? countryData.isoCode : "";
      name = countryData ? countryData.name : "";
    }

    const stateData = State.getStatesOfCountry(country).find(
      item => item.name === state
    );
    const StateCode = stateData ? stateData.isoCode : "";

    const orgAddr = {
      id,
      addressLine1,
      addressLine2,
      city: {
        value: city,
        label: city,
      },
      country: {
        label: name,
        value: isoCode,
        code: isoCode,
      },
      state: {
        value: state,
        label: state,
        code: StateCode,
      },
      zipcode: pin,
    };

    const organizationSchema = {
      logoUrl: companyDetails.logo,
      companyName: companyDetails.name,
      companyAddr: orgAddr,
      companyPhone: companyDetails.business_phone,
      countryName: companyDetails.country,
      companyCurrency: companyDetails.currency,
      companyRate: parseFloat(companyDetails.standard_price.toString()).toFixed(
        2
      ),
      companyFiscalYear: companyDetails.fiscal_year_end,
      companyDateFormat: companyDetails.date_format,
      companyTimezone: companyDetails.timezone,
      id: companyDetails.id,
      logo: null,
    };

    setOrgDetails(organizationSchema);

    const timezonesEntry = await companyProfileApi.get();
    setTimezones(timezonesEntry.data.timezones);

    const timeZonesForCountry = timezonesEntry.data.timezones[isoCode];

    let timezoneOptionList = [];
    if (timeZonesForCountry) {
      timezoneOptionList = timeZonesForCountry.map(item => ({
        value: item,
        label: item,
      }));
    }

    setTimezoneOption(timezoneOptionList);
    addCity(isoCode, StateCode ?? state);
    setIsLoading(false);
  };

  const assignCountries = async allCountries => {
    const countryData = await allCountries.map(country => ({
      value: country.isoCode,
      label: country.name,
      code: country.isoCode,
    }));
    setCountries(countryData);
  };

  useEffect(() => {
    sendGAPageView();
    getCurrencies();
    getData();
    const allCountries = Country.getAllCountries();
    assignCountries(allCountries);
  }, []);

  useEffect(() => {
    const currentCountry = Country.getAllCountries().filter(
      country => country.isoCode == orgDetails.companyAddr.country.code
    )[0];

    currentCountry &&
      setCurrentCountryDetails({
        label: currentCountry.name,
        value: currentCountry.name,
        code: currentCountry.isoCode,
      });
  }, [orgDetails]);

  const handleAddrChange = useCallback(
    (e, type) => {
      const { companyAddr } = orgDetails;
      if (type === "addressLine1") {
        const changedAddr = { ...companyAddr, addressLine1: e.target.value };
        setOrgDetails({ ...orgDetails, companyAddr: changedAddr });
      } else {
        const changedAddr = { ...companyAddr, addressLine2: e.target.value };
        setOrgDetails({ ...orgDetails, companyAddr: changedAddr });
      }
      setIsDetailUpdated(true);
    },
    [orgDetails]
  );

  const setupTimezone = (orgDetails, countryCode) => {
    const timeZonesForCountry = timezones[countryCode];
    const timezoneOptionList = timeZonesForCountry.map(item => ({
      value: item,
      label: item,
    }));
    setTimezoneOption(timezoneOptionList);
    setOrgDetails({
      ...orgDetails,
      countryName: countryCode,
      companyTimezone:
        countryCode === "US"
          ? "(GMT-05:00) Eastern Time (US & Canada)"
          : timezoneOptionList[0].value,
    });
  };

  const handleChangeCompanyDetails = useCallback(
    (e, type) => {
      setOrgDetails({ ...orgDetails, [type]: e });
      setIsDetailUpdated(true);
      setErrDetails({ ...errDetails, [`${type}Err`]: "" });
    },
    [orgDetails, errDetails]
  );

  const handleOnChangeCountry = selectCountry => {
    const { companyAddr } = orgDetails;
    const changedCountry = {
      ...companyAddr,
      country: selectCountry,
      state: {},
      city: {},
    };
    setCurrentCountryDetails(selectCountry);

    setupTimezone(
      { ...orgDetails, companyAddr: changedCountry },
      selectCountry.code
    );
    setIsDetailUpdated(true);
  };

  const addCity = (country, state) => {
    const cities = City.getCitiesOfState(country, state).map(city => ({
      label: city.name,
      value: city.name,
      ...city,
    }));
    setCurrentCityList(cities);
  };

  const handleOnChangeState = selectState => {
    const { companyAddr } = orgDetails;
    const changedState = {
      ...companyAddr,
      state: {
        value: selectState.name,
        label: selectState.name,
        code: selectState.code,
      },
      city: { label: "", value: "" },
    };
    setOrgDetails({ ...orgDetails, companyAddr: changedState });
    addCity(currentCountryDetails.code, selectState.code);
  };

  const updatedStates = countryCode =>
    State.getStatesOfCountry(countryCode).map(state => ({
      label: state.name,
      value: state.name,
      code: state.isoCode,
      ...state,
    }));

  useEffect(() => {
    const stateList = updatedStates(orgDetails.companyAddr.country.value);
    setStateList(stateList);
  }, [orgDetails.companyAddr.country]);

  useEffect(() => {
    setCurrentCityList(
      City.getCitiesOfState(
        orgDetails.companyAddr.country.code,
        orgDetails?.companyAddr?.state?.code ??
          orgDetails?.companyAddr?.state?.value
      ).map(city => ({ label: city.name, value: city.name, ...city }))
    );
  }, [orgDetails.companyAddr.state]);

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

  const handleCurrencyChange = useCallback(
    option => {
      setOrgDetails({ ...orgDetails, companyCurrency: option.value });
      setIsDetailUpdated(true);
    },
    [orgDetails]
  );

  const handleFiscalYearChange = useCallback(
    option => {
      setOrgDetails({ ...orgDetails, companyFiscalYear: option.value });
      setIsDetailUpdated(true);
    },
    [orgDetails]
  );

  const handleDateFormatChange = useCallback(
    option => {
      setOrgDetails({ ...orgDetails, companyDateFormat: option.value });
      setIsDetailUpdated(true);
    },
    [orgDetails]
  );

  const handleTimezoneChange = useCallback(
    option => {
      setOrgDetails({ ...orgDetails, companyTimezone: option.value });
      setIsDetailUpdated(true);
    },
    [orgDetails]
  );

  const handleZipcodeChange = e => {
    const { companyAddr } = orgDetails;
    const changedZipCode = { ...companyAddr, zipcode: e.target.value };
    setOrgDetails({ ...orgDetails, companyAddr: changedZipCode });
    setIsDetailUpdated(true);
  };

  const onLogoChange = useCallback(
    e => {
      const file = e.target.files[0];
      setOrgDetails({
        ...orgDetails,
        logoUrl: URL.createObjectURL(file),
        logo: file,
      });
      setIsDetailUpdated(true);
    },
    [orgDetails]
  );

  const handleUpdateOrgDetails = async () => {
    try {
      await orgSchema.validate(
        {
          companyName: orgDetails.companyName,
          companyPhone: orgDetails.companyPhone,
          companyAddr: {
            addressLine1: orgDetails.companyAddr.addressLine1,
            addressLine2: orgDetails.companyAddr.addressLine2,
            country: orgDetails.companyAddr.country.value,
            state: orgDetails.companyAddr.state.value,
            city: orgDetails.companyAddr.city.value,
            zipcode: orgDetails.companyAddr.zipcode,
          },
          companyRate: orgDetails.companyRate,
        },
        { abortEarly: false }
      );
      await updateOrgDetails();
      navigate(`/profile/edit/organization-details`, { replace: true });
    } catch (err) {
      const errObj = {
        companyNameErr: "",
        companyPhoneErr: "",
        addressLine1Err: "",
        addressLine2Err: "",
        stateErr: "",
        countryErr: "",
        cityErr: "",
        zipcodeErr: "",
        companyRateErr: "",
      };

      err.inner.map(item => {
        errObj[`${item.path.split(".").pop()}Err`] = item.message;
      });
      setErrDetails(errObj);
    }
  };

  const updateOrgDetails = async () => {
    try {
      setIsLoading(true);
      const formD = new FormData();
      formD.append("company[name]", orgDetails.companyName);
      formD.append("company[business_phone]", orgDetails.companyPhone);
      formD.append("company[country]", orgDetails.companyAddr.country.value);
      formD.append("company[base_currency]", orgDetails.companyCurrency);
      formD.append(
        "company[standard_price]",
        orgDetails.companyRate.toString()
      );

      formD.append("company[fiscal_year_end]", orgDetails.companyFiscalYear);
      formD.append("company[date_format]", orgDetails.companyDateFormat);
      formD.append("company[timezone]", orgDetails.companyTimezone);
      formD.append(
        "company[addresses_attributes[0][id]]",
        orgDetails.companyAddr.id
      );

      formD.append(
        "company[addresses_attributes[0][address_line_1]]",
        orgDetails.companyAddr.addressLine1
      );

      formD.append(
        "company[addresses_attributes[0][address_line_2]]",
        orgDetails.companyAddr.addressLine2
      );

      formD.append(
        "company[addresses_attributes[0][state]]",
        orgDetails.companyAddr.state?.value
      );

      formD.append(
        "company[addresses_attributes[0][city]]",
        orgDetails.companyAddr.city?.value
      );

      formD.append(
        "company[addresses_attributes[0][country]]",
        orgDetails.companyAddr.country?.value
      );

      formD.append(
        "company[addresses_attributes[0][pin]]",
        orgDetails.companyAddr.zipcode
      );

      if (orgDetails.logo) {
        formD.append("company[logo]", orgDetails.logo);
      }
      await companiesApi.update(orgDetails.id, formD);
      setIsDetailUpdated(false);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      Toastr.error("Error in Updating Org. Details");
    }
  };

  const handleCancelAction = () => {
    getCurrencies();
    getData();
    setIsDetailUpdated(false);
    navigate(`/profile/edit/organization-details`, { replace: true });
  };

  const handleDeleteLogo = async () => {
    const removeLogo = await companiesApi.removeLogo(orgDetails.id);
    if (removeLogo.status === 200) {
      setOrgDetails({ ...orgDetails, logoUrl: null, logo: null });
    }
  };

  const handleOnChangeCity = selectCity => {
    const { companyAddr } = orgDetails;
    const changedCountry = { ...companyAddr, city: selectCity };
    setOrgDetails({ ...orgDetails, companyAddr: changedCountry });
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        showButtons
        cancelAction={handleCancelAction}
        isDisableUpdateBtn={isDetailUpdated}
        saveAction={handleUpdateOrgDetails}
        subTitle=""
        title="Organization Settings"
      />
      {isLoading ? (
        <div className="flex h-80v w-full flex-col justify-center">
          <Loader />
        </div>
      ) : (
        <StaticPage
          cancelAction={handleCancelAction}
          countries={countries}
          currenciesOption={currenciesOption}
          currentCityList={currentCityList}
          dateFormatOptions={dateFormatOptions}
          errDetails={errDetails}
          fiscalYearOptions={fiscalYearOptions}
          getInputProps={getInputProps}
          getRootProps={getRootProps}
          handleAddrChange={handleAddrChange}
          handleChangeCompanyDetails={handleChangeCompanyDetails}
          handleCurrencyChange={handleCurrencyChange}
          handleDateFormatChange={handleDateFormatChange}
          handleDeleteLogo={handleDeleteLogo}
          handleFiscalYearChange={handleFiscalYearChange}
          handleOnChangeCity={handleOnChangeCity}
          handleOnChangeCountry={handleOnChangeCountry}
          handleOnChangeState={handleOnChangeState}
          handleTimezoneChange={handleTimezoneChange}
          handleZipcodeChange={handleZipcodeChange}
          isDragActive={isDragActive}
          orgDetails={orgDetails}
          promiseOptions={promiseOptions}
          saveAction={handleUpdateOrgDetails}
          stateList={stateList}
          timezoneOption={timezoneOption}
          onLogoChange={onLogoChange}
        />
      )}
    </div>
  );
};

export default OrgEdit;
