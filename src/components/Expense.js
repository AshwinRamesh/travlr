import React from "react";

function Expense({expenseId, name, cost}) {
  return (
    <li key={expenseId}>{name} - {cost}</li>
  )
}

export default function ExpenseSection({expenses}) {


  return (
    <div className="rounded px-3 bg-neutral-100 m-2 w-full">
      <h2 className={"text-lg font-semibold mb-3"}>💰Expenses (${expenses.total_expense})</h2>
      <ul>
        {expenses.accommodation_expense &&
          <Expense expenseId="NA" name={"Accommodation"} cost={expenses.accommodation_expense.expense_per_night}/>
        }
        {
          expenses.other_expenses.map(e => {
            return <Expense expenseId={e.id} name={e.name} cost={e.cost}/>
          })
        }
      </ul>
    </div>
  );
}