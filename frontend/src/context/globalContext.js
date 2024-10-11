import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "http://localhost:9000/api/v1/";


const GlobalContext = React.createContext()
export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Add income
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income);
            // Check if response data exists
            if (response.data) {
                getIncomes();
            } else {
                setError('Unexpected response format from add-income');
            }
        } catch (err) {
            // Handle error if response.data is not available
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred while adding income');
            }
        }
    };

    // Get incomes
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            if (response.data) {
                setIncomes(response.data);
                console.log(response.data);
            } else {
                setError('Unexpected response format from get-incomes');
            }
        } catch (err) {
            setError('An unexpected error occurred while fetching incomes');
        }
    };

    // Delete income
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError('An unexpected error occurred while deleting income');
        }
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Add expense
    const addExpense = async (expense) => {
        try {
            const response = await axios.post(`${BASE_URL}add-expense`, expense);
            if (response.data) {
                getExpenses();
            } else {
                setError('Unexpected response format from add-expense');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred while adding expense');
            }
        }
    };

    // Get expenses
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            if (response.data) {
                setExpenses(response.data);
                console.log(response.data);
            } else {
                setError('Unexpected response format from get-expenses');
            }
        } catch (err) {
            setError('An unexpected error occurred while fetching expenses');
        }
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError('An unexpected error occurred while deleting expense');
        }
    };

    // Calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Get transaction history
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};