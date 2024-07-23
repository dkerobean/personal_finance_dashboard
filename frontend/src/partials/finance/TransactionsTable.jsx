import React from 'react';
import TransactionsTableItem from './TransactionsTableItem';

function TransactionsTable({ selectedItems, transactions, currency, handleSelectedItems }) {
  const { incomes, expenses } = transactions;

  const allTransactions = [...incomes, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-white shadow-md rounded my-6">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Select</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {allTransactions.map((transaction) => {
            const date = new Date(transaction.date);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(date);

            return (
              <TransactionsTableItem
                key={transaction.id}
                id={transaction.id}
                name={transaction.category.name ? transaction.category.name : 'No Name'}
                date={formattedDate}
                status={transaction.transaction_type ? transaction.transaction_type : 'No Category'}
                amount={`${transaction.transaction_type === 'income' ? '+' : '-'}${currency}${transaction.amount}`}
                handleClick={() => handleSelectedItems(transaction.id)}
                isChecked={selectedItems.includes(transaction.id)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;