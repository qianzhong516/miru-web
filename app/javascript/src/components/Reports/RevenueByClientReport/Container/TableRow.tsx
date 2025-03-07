import React from "react";

import { currencyFormat } from "helpers";
import { Avatar } from "StyledComponents";

import { RevenueByClients } from "../interface";

const TableRow = ({ currency, report }) => {
  const {
    id,
    logo,
    name,
    outstandingAmount,
    overdueAmount,
    paidAmount,
    totalAmount,
  }: RevenueByClients = report;

  return (
    <tr className="flex flex-row items-center" key={id}>
      <td className="w-4/12 whitespace-nowrap py-4 pr-6 text-left">
        <span className="flex items-center">
          <Avatar classNameImg="mr-2 lg:mr-6" url={logo} />
          <p className="whitespace-normal text-base font-normal text-miru-dark-purple-1000">
            {name}
          </p>
        </span>
      </td>
      <td className="w-2/12 whitespace-pre-wrap px-0 py-4 text-right text-base font-normal text-miru-dark-purple-1000">
        {currencyFormat(currency, overdueAmount)}
      </td>
      <td className="w-2/12 whitespace-pre-wrap px-0 py-4 text-right text-base font-normal text-miru-dark-purple-1000">
        {currencyFormat(currency, outstandingAmount)}
      </td>
      <td className="w-2/12 whitespace-nowrap px-6 py-4 text-right">
        <p className="text-base	 font-normal text-miru-dark-purple-1000">
          {currencyFormat(currency, paidAmount)}
        </p>
      </td>
      <td className="w-2/12 whitespace-nowrap py-4 pl-0 text-right text-xl font-bold text-miru-dark-purple-1000">
        {currencyFormat(currency, totalAmount)}
      </td>
    </tr>
  );
};

export default TableRow;
