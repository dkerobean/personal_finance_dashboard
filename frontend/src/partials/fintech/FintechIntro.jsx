import React from 'react';


import UserImage from '../../images/user-64-14.jpg';
import FintechIcon01 from '../../images/company-icon-01.svg';
import FintechIcon02 from '../../images/company-icon-02.svg';
import FintechIcon03 from '../../images/company-icon-03.svg';
import FintechIcon04 from '../../images/company-icon-04.svg';
import Datepicker from '../../components/Datepicker';



function FintechIntro( {profile} ) {

  const userProfile = profile ? profile : '0.00';
  const currency = userProfile ? userProfile.currency_symbol : '$';

  return (
    <div className="flex flex-col col-span-full bg-white shadow-lg rounded-sm border border-slate-200">
      <div className="px-5 py-6">
        <div className="md:flex md:justify-between md:items-center">
          {/* Left side */}
          <div className="flex items-center mb-4 md:mb-0">
            {/* Avatar */}
            {/* <div className="mr-4">
              <img className="inline-flex rounded-full" src={UserImage} width="64" height="64" alt="User" />
            </div> */}
            {/* User info */}
            <div>
              <div className="mb-2">
                <strong className="font-medium text-slate-800">Net Worth</strong>
              </div>
              <div className="text-3xl font-bold text-emerald-500">{currency}{userProfile.net_worth}</div>
            </div>
          </div>
          {/* Right side */}
          <ul className="shrink-0 flex flex-wrap justify-end md:justify-start -space-x-6 -ml-px">
            <li>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

                {/* Datepicker built with flatpickr */}
                <Datepicker align="right" />
                {/* Add view button */}
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Add Record</span>
                </button>
              </div>
              {/* <button className="flex justify-center items-center w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-indigo-500 shadow-sm transition duration-150">
                <span className="sr-only">Add new user</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
              </button> */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FintechIntro;
