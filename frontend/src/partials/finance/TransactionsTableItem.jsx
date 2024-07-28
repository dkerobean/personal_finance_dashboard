import React from 'react';
import transactionImage from '../../images/transactions-image-02.svg';

function TransactionsTableItem({ id, name, date, status, amount, handleClick, isChecked }) {
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
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
        <div className="flex items-center">
          <label className="inline-flex items-center">
            <span className="sr-only">Select</span>
            <input
              id={id}
              className="form-checkbox mr-3"
              type="checkbox"
              onChange={() => handleClick(id)}
              checked={isChecked}
            />
            <div className="w-9 h-9 shrink-0 mr-2 sm:mr-3">
              <img className="rounded-full" src={transactionImage} width="36" height="36" alt={name} />
            </div>
            <div className="font-medium text-slate-800">{name}</div>
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{date}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(status)}`}>{status}</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className={`text-right font-medium ${amountColor(amount)}`}>{amount}</div>
      </td>
    </tr>
  );
}

export default TransactionsTableItem;