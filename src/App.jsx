import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Add Transaction
  const addTransaction = async () => {
    if (title.trim() === "" || amount === "") {
      alert("Please enter title and amount");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const newTransaction = {
      title: title,
      amount: Number(amount),
      type: type,
      category: category,
      date: date,
    };
    try {
      const response = await fetch("http://localhost:8083/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction");
      }

      const savedTransaction = await response.json();

      setTransactions((currentTransactions) => [
        ...currentTransactions,
        savedTransaction,
      ]);

      setSuccessMessage("Transaction added successfully!");

      clearForm();
    } catch (error) {
      console.error(error);
      alert("Failed to store transaction");
    }
  };

  useEffect(() => {
    if (successMessage === "") {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8083/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  // Delete Transaction
  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8083/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction.id !== id),
      );

      setSuccessMessage("Transaction deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete transaction");
    }
  };

  // Open Edit Form
  const editTransaction = (transaction) => {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.date || "");
    setShowForm(true);
  };

  // Update Transaction
  const updateTransaction = async () => {
    if (title.trim() === "" || amount === "") {
      alert("Please enter title and amount");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const updatedTransaction = {
      title: title,
      amount: Number(amount),
      type: type,
      category: category,
      date: date,
    };

    console.log("Date being sent:", date);

    try {
      const response = await fetch(
        `http://localhost:8083/transactions/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTransaction),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const savedTransaction = await response.json();

      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === editingId ? savedTransaction : transaction,
        ),
      );

      setSuccessMessage("Transaction updated successfully!");

      clearForm();
    } catch (error) {
      console.error(error);
      alert("Failed to update transaction");
    }
  };

  // Clear Form
  const clearForm = () => {
    setTitle("");
    setAmount("");
    setType("Expense");
    setCategory("Food");
    setEditingId(null);
    setShowForm(false);
  };

  // Calculations
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyTransactions = transactions.filter((transaction) => {
    if (selectedMonth === "") {
      return true;
    }

    return transaction.date?.startsWith(selectedMonth);
  });

  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpense;

  const balance = totalIncome - totalExpense;
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "All" || transaction.type === filterType;

      const matchesDate = filterDate === "" || transaction.date === filterDate;

      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;

      return new Date(b.date) - new Date(a.date);
    });
  const categoryData = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Salary",
    "Other",
  ]
    .map((category) => ({
      name: category,
      value: monthlyTransactions
        .filter(
          (transaction) =>
            transaction.category === category && transaction.type === "Expense",
        )
        .reduce((total, transaction) => total + transaction.amount, 0),
    }))
    .filter((item) => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Smart Expense Tracker
            </h1>
            <p className="text-sm text-gray-500">Manage your money smartly</p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setAmount("");
              setType("Expense");
              setCategory("Food");
              setShowForm(true);
            }}
            className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
          >
            + Add Transaction
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-green-700">
            {successMessage}
          </div>
        )}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">
            Select Month
          </label>

          <div className="mt-2 flex gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={() => setSelectedMonth("")}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Balance</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              ₹{monthlyBalance}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ₹{monthlyIncome}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Expense</p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              ₹{monthlyExpense}
            </h2>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId === null ? "Add Transaction" : "Edit Transaction"}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Title */}
              <input
                type="text"
                placeholder="Transaction title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Amount */}
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                min="1"
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Type */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Expense</option>
                <option>Income</option>
              </select>

              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Salary</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={
                  editingId === null ? addTransaction : updateTransaction
                }
                className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
              >
                {editingId === null ? "Save Transaction" : "Update Transaction"}
              </button>

              <button
                onClick={clearForm}
                className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Expense Chart */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800">
            Expense Overview
            {selectedMonth &&
              ` - ${new Date(selectedMonth + "-01").toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  year: "numeric",
                },
              )}`}
          </h2>
          {categoryData.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Add some expense transactions to see the chart.
            </p>
          ) : (
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        {/* Recent Transactions */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Transactions
          </h2>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={() => setSearchTerm("")}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Clear
              </button>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Transactions</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mt-6 space-y-4">
            {transactions.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                No transactions yet.
              </p>
            ) : filteredTransactions.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                No matching transactions found.
              </p>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between"
                >
                  {/* Transaction details */}
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {transaction.category}
                    </p>
                    <p className="text-sm text-gray-400">{transaction.type}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>

                  {/* Amount + Buttons */}
                  <div className="flex items-center">
                    <p
                      className={`font-semibold ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"} ₹
                      {transaction.amount.toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => editTransaction(transaction)}
                      className="ml-4 rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="ml-2 rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
