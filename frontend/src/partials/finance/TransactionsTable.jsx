import React from 'react';
import TransactionsTableItem from './TransactionsTableItem';

function TransactionsTable({ selectedItems, transactions, currency, handleSelectedItems }) {
  const { incomes, expenses } = transactions;

  const allTransactions = [...incomes, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const groupedTransactions = allTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(transaction);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow-md rounded my-6">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {Object.keys(groupedTransactions).map((date) => (
            <React.Fragment key={date}>
              <tr>
                <td colSpan="4" className="bg-gray-100 text-gray-700 text-sm font-bold py-2 px-4">{date}</td>
              </tr>
              {groupedTransactions[date].map((transaction) => (
                <TransactionsTableItem
                  key={transaction.id}
                  id={transaction.id}
                  name={transaction.category.name ? transaction.category.name : 'No Name'}
                  date={date}
                  status={transaction.transaction_type ? transaction.transaction_type : 'No Category'}
                  amount={`${transaction.transaction_type === 'income' ? '+' : '-'}${currency}${transaction.amount}`}
                  handleClick={() => handleSelectedItems(transaction.id)}
                  isChecked={selectedItems.includes(transaction.id)}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;