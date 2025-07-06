import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../App';
import { 
  PlusCircle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  LogOut,
  Edit2,
  Trash2,
  Heart,
  Receipt,
  Wallet,
  BarChart3
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    category: 'Venue',
    description: '',
    expectedAmount: '',
    actualAmount: '',
    status: 'expected'
  });

  // Income form state
  const [incomeForm, setIncomeForm] = useState({
    source: 'Savings',
    description: '',
    amount: ''
  });

  const categories = [
    'Venue', 'Catering', 'Photography', 'Flowers', 'Music', 
    'Decorations', 'Attire', 'Transportation', 'Invitations', 'Other'
  ];

  const incomeSources = [
    'Savings', 'Gift from Parents', 'Loan', 'Investment Returns', 'Salary', 'Other'
  ];

  useEffect(() => {
    if (!user) return;

    // Listen to expenses
    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const unsubExpenses = onSnapshot(expensesRef, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
    });

    // Listen to income
    const incomeRef = collection(db, 'users', user.uid, 'income');
    const unsubIncome = onSnapshot(incomeRef, (snapshot) => {
      const incomeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIncome(incomeData);
    });

    return () => {
      unsubExpenses();
      unsubIncome();
    };
  }, [user]);

  const handleSignOut = () => {
    signOut(auth);
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateDoc(doc(db, 'users', user.uid, 'expenses', editingExpense.id), {
          ...expenseForm,
          expectedAmount: parseFloat(expenseForm.expectedAmount),
          actualAmount: expenseForm.actualAmount ? parseFloat(expenseForm.actualAmount) : 0,
          updatedAt: new Date()
        });
        setEditingExpense(null);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'expenses'), {
          ...expenseForm,
          expectedAmount: parseFloat(expenseForm.expectedAmount),
          actualAmount: expenseForm.actualAmount ? parseFloat(expenseForm.actualAmount) : 0,
          createdAt: new Date()
        });
      }
      setExpenseForm({ category: 'Venue', description: '', expectedAmount: '', actualAmount: '', status: 'expected' });
      setShowExpenseForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const addIncome = async (e) => {
    e.preventDefault();
    try {
      if (editingIncome) {
        await updateDoc(doc(db, 'users', user.uid, 'income', editingIncome.id), {
          ...incomeForm,
          amount: parseFloat(incomeForm.amount),
          updatedAt: new Date()
        });
        setEditingIncome(null);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'income'), {
          ...incomeForm,
          amount: parseFloat(incomeForm.amount),
          createdAt: new Date()
        });
      }
      setIncomeForm({ source: 'Savings', description: '', amount: '' });
      setShowIncomeForm(false);
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'income', id));
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const editExpense = (expense) => {
    setExpenseForm({
      category: expense.category,
      description: expense.description,
      expectedAmount: expense.expectedAmount.toString(),
      actualAmount: expense.actualAmount ? expense.actualAmount.toString() : '',
      status: expense.status
    });
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const editIncomeItem = (incomeItem) => {
    setIncomeForm({
      source: incomeItem.source,
      description: incomeItem.description,
      amount: incomeItem.amount.toString()
    });
    setEditingIncome(incomeItem);
    setShowIncomeForm(true);
  };

  // Calculations
  const totalExpected = expenses.reduce((sum, exp) => sum + (exp.expectedAmount || 0), 0);
  const totalActual = expenses.reduce((sum, exp) => sum + (exp.actualAmount || 0), 0);
  const totalIncome = income.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const remaining = totalIncome - totalExpected;

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-white mr-3" fill="currentColor" />
            <div>
              <h1 className="text-2xl font-bold text-white">Wedding Bells</h1>
              <p className="text-white/80">Welcome back, {user.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="btn-secondary">
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <p className="text-white/80 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-white">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <p className="text-white/80 text-sm">Expected Costs</p>
              <p className="text-2xl font-bold text-white">${totalExpected.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-orange-400 mr-3" />
            <div>
              <p className="text-white/80 text-sm">Actual Spent</p>
              <p className="text-2xl font-bold text-white">${totalActual.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <BarChart3 className={`w-8 h-8 mr-3 ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <div>
              <p className="text-white/80 text-sm">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</p>
              <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(remaining).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass p-2 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'expenses' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <Receipt className="w-5 h-5 inline mr-2" />
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'income' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <Wallet className="w-5 h-5 inline mr-2" />
            Income
          </button>
        </div>
      </div>

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-white">Wedding Expenses</h2>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="btn-primary"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>

          {showExpenseForm && (
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <form onSubmit={addExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="text-black">{cat}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Description"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="input-field"
                    required
                  />
                  
                  <input
                    type="number"
                    placeholder="Expected Amount"
                    value={expenseForm.expectedAmount}
                    onChange={(e) => setExpenseForm({...expenseForm, expectedAmount: e.target.value})}
                    className="input-field"
                    step="0.01"
                    required
                  />
                  
                  <input
                    type="number"
                    placeholder="Actual Amount (optional)"
                    value={expenseForm.actualAmount}
                    onChange={(e) => setExpenseForm({...expenseForm, actualAmount: e.target.value})}
                    className="input-field"
                    step="0.01"
                  />
                </div>
                
                <select
                  value={expenseForm.status}
                  onChange={(e) => setExpenseForm({...expenseForm, status: e.target.value})}
                  className="input-field"
                >
                  <option value="expected" className="text-black">Expected</option>
                  <option value="pending" className="text-black">Pending</option>
                  <option value="paid" className="text-black">Paid</option>
                </select>
                
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary flex-1">
                    {editingExpense ? 'Update' : 'Add'} Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setEditingExpense(null);
                      setExpenseForm({ category: 'Venue', description: '', expectedAmount: '', actualAmount: '', status: 'expected' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {expenses.map(expense => (
              <div key={expense.id} className="bg-white/10 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{expense.description}</h3>
                      <p className="text-white/70 text-sm">{expense.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white font-semibold">${expense.expectedAmount?.toFixed(2)}</p>
                    {expense.actualAmount > 0 && (
                      <p className="text-white/70 text-sm">Actual: ${expense.actualAmount?.toFixed(2)}</p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    expense.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    expense.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {expense.status}
                  </div>
                  <button
                    onClick={() => editExpense(expense)}
                    className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {expenses.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">No expenses yet. Add your first expense to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-white">Income Sources</h2>
            <button
              onClick={() => setShowIncomeForm(true)}
              className="btn-primary"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Income
            </button>
          </div>

          {showIncomeForm && (
            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingIncome ? 'Edit Income' : 'Add New Income'}
              </h3>
              <form onSubmit={addIncome} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={incomeForm.source}
                    onChange={(e) => setIncomeForm({...incomeForm, source: e.target.value})}
                    className="input-field"
                  >
                    {incomeSources.map(source => (
                      <option key={source} value={source} className="text-black">{source}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Description"
                    value={incomeForm.description}
                    onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                    className="input-field"
                    required
                  />
                  
                  <input
                    type="number"
                    placeholder="Amount"
                    value={incomeForm.amount}
                    onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                    className="input-field"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary flex-1">
                    {editingIncome ? 'Update' : 'Add'} Income
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowIncomeForm(false);
                      setEditingIncome(null);
                      setIncomeForm({ source: 'Savings', description: '', amount: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {income.map(incomeItem => (
              <div key={incomeItem.id} className="bg-white/10 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500/20 rounded-lg p-2 flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">{incomeItem.description}</h3>
                      <p className="text-white/70 text-sm">{incomeItem.source}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-green-400 font-semibold text-lg">${incomeItem.amount?.toFixed(2)}</p>
                  <button
                    onClick={() => editIncomeItem(incomeItem)}
                    className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteIncome(incomeItem.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {income.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">No income sources yet. Add your first income source!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
