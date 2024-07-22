import React from 'react';
import transactionImage from '../../images/transactions-image-02.svg';

function TransactionsTableItem(props) {

  const statusColor = (status) => {
    switch (status) {
      case 'income':
        return 'bg-green-100 text-green-600';
      case 'expense':
        return 'bg-red-100 text-red-500';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const amountColor = (amount) => {
    switch (amount.charAt(0)) {
      case '+':
        return 'text-green-600';
      case '-':
        return 'text-red-600 font-bold';
      default:
        return 'text-slate-700 font-bold';
    }
  };

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input id={props.id} className="form-checkbox" type="checkbox" onChange={props.handleClick} checked={props.isChecked} />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
        <div className="flex items-center">
          <div className="w-9 h-9 shrink-0 mr-2 sm:mr-3">
            <img className="rounded-full" src={transactionImage} width="36" height="36" alt={props.name} />
          </div>
          <div className="font-medium text-slate-800">{props.name}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{props.date}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(props.status)}`}>{props.status}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className={`text-right font-medium ${amountColor(props.amount)}`}>{props.amount}</div>
      </td>
    </tr>
  );
}

export default TransactionsTableItem;