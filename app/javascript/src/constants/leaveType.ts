import {
  CakeIconSVG,
  CalendarBlackIconSVG,
  CarIconSVG,
  VacationIconSVG,
  FlowerIconSVG,
  UserIconSVG,
  MedicineIconSVG,
  BabyIconSVG,
} from "miruIcons";

export const leaveTypes = [
  {
    value: "annual",
    label: "Annual leaves",
  },
  {
    value: "sick",
    label: "Sick leaves",
  },
  {
    value: "maternity",
    label: "Maternity leave",
  },
  {
    value: "paternity",
    label: "Paternity leave",
  },
  {
    value: "period",
    label: "Period leave",
  },
];

export const leaveColors = [
  {
    value: "#0E79B2",
    label: "Chart Blue",
  },
  {
    value: "#BF1363",
    label: "Chart Pink",
  },
  {
    value: "#F39237",
    label: "Chart Orange",
  },
  {
    value: "#058C42",
    label: "Chart Green",
  },
  {
    value: "#7768AE",
    label: "Chart Purple",
  },
  {
    value: "#68AEAA",
    label: "Chart Light Blue",
  },
  {
    value: "#C97CC1",
    label: "Chart Light Pink",
  },
  {
    value: "#7CC984",
    label: "Chart Light Green",
  },
];

export const leaveIcons = [
  { value: "calendar", label: "label", icon: CalendarBlackIconSVG },
  { value: "cake", label: "label2", icon: CakeIconSVG },
  { value: "vacation", label: "label3", icon: VacationIconSVG },
  { value: "medicine", label: "label4", icon: MedicineIconSVG },
  { value: "baby", label: "label5", icon: BabyIconSVG },
  { value: "flower", label: "label6", icon: FlowerIconSVG },
  { value: "car", label: "label7", icon: CarIconSVG },
  { value: "user", label: "label8", icon: UserIconSVG },
];

export const repetitionTypeObj = {
  per_month: "per month",
  per_year: "per year",
  per_week: "per week",
  per_quarter: "per quarter",
};

export const countTypeOptions = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
];

export const repetitionType = [
  { value: "per_week", label: "per week" },
  { value: "per_month", label: "per month" },
  { value: "per_quarter", label: "per quarter" },
  { value: "per_year", label: "per year" },
];

export const quarter_one = [
  {
    id: 0,
    name: "January",
  },
  {
    id: 1,
    name: "February",
  },
  {
    id: 2,
    name: "March",
  },
];

export const quarter_two = [
  {
    id: 3,
    name: "April",
  },
  {
    id: 4,
    name: "May",
  },
  {
    id: 5,
    name: "June",
  },
];

export const quarter_three = [
  {
    id: 6,
    name: "July",
  },
  {
    id: 7,
    name: "August",
  },
  {
    id: 8,
    name: "September",
  },
];

export const quarter_four = [
  {
    id: 9,
    name: "October",
  },
  {
    id: 10,
    name: "November",
  },
  {
    id: 11,
    name: "December",
  },
];

export const yearCalendar = {
  0: {
    name: "Jan - Mar",
    quarter: quarter_one,
  },
  1: {
    name: "Apr - Jun",
    quarter: quarter_two,
  },
  2: {
    name: "Jul - Sept",
    quarter: quarter_three,
  },
  3: {
    name: "Oct - Dec",
    quarter: quarter_four,
  },
};
