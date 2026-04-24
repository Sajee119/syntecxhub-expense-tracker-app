import { useCallback, useEffect, useMemo, useState } from 'react'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import { getCurrencySymbol } from '../../utils/currency'
import './Expense.css'

const EXPENSE_CATEGORIES = ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other']

const initialExpenseForm = {
  amount: '',
  description: '',
  category: 'General',
  date: new Date().toISOString().slice(0, 10),
}

const Expense = ({ user, setToast }) => {
  const currencySymbol = getCurrencySymbol(user?.currency)
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState(initialExpenseForm)
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expenseToDelete, setExpenseToDelete] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false)

  const pageSize = 8

  const loadExpenses = useCallback(async () => {
    try {
      const data = await apiRequest('/expenses')
      setExpenses(data?.expenses || [])
    } catch (error) {
      handleError(setToast, error)
    } finally {
      setIsLoading(false)
    }
  }, [setToast])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadExpenses()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadExpenses])

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const text = String(expense.text || '').toLowerCase()
      const category = String(expense.category || 'General')
      const createdDate = new Date(expense.createdAt)

      const matchesSearch = text.includes(searchQuery.trim().toLowerCase())
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory
      const matchesDateFrom = dateFrom ? createdDate >= new Date(`${dateFrom}T00:00:00`) : true
      const matchesDateTo = dateTo ? createdDate <= new Date(`${dateTo}T23:59:59`) : true

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo
    })
  }, [expenses, searchQuery, selectedCategory, dateFrom, dateTo])

  const sortedExpenses = useMemo(() => {
    const next = [...filteredExpenses]

    if (sortBy === 'oldest') {
      next.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      return next
    }

    if (sortBy === 'highest') {
      next.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
      return next
    }

    if (sortBy === 'lowest') {
      next.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0))
      return next
    }

    next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return next
  }, [filteredExpenses, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedExpenses = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize
    return sortedExpenses.slice(startIndex, startIndex + pageSize)
  }, [sortedExpenses, safeCurrentPage])

  const topCategories = useMemo(() => {
    const map = new Map()

    filteredExpenses.forEach((expense) => {
      const key = expense.category || 'General'
      map.set(key, (map.get(key) || 0) + Number(expense.amount || 0))
    })

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [filteredExpenses])

  const categoryBreakdown = useMemo(() => {
    const map = new Map()
    const total = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

    filteredExpenses.forEach((expense) => {
      const category = expense.category || 'General'
      map.set(category, (map.get(category) || 0) + Number(expense.amount || 0))
    })

    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [filteredExpenses])

  const filteredTotalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  }, [filteredExpenses])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setForm(initialExpenseForm)
    setEditingId(null)
    setIsUpdateConfirmOpen(false)
  }

  const submitExpense = async ({ isEdit }) => {
    if (!form.amount || !form.description || !form.date) {
      setToast({ type: 'error', message: 'Please fill amount, description and date.' })
      return
    }

    const payload = {
      amount: Number(form.amount),
      description: form.description,
      category: form.category,
      date: form.date,
    }

    setIsSubmitting(true)
    try {
      if (isEdit && editingId) {
        await apiRequest(`/expenses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        handleSuccess(setToast, 'Expense updated successfully')
      } else {
        await apiRequest('/expenses', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        handleSuccess(setToast, 'Expense added successfully')
      }

      resetForm()
      setIsLoading(true)
      await loadExpenses()
    } catch (error) {
      handleError(setToast, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (editingId) {
      if (!form.amount || !form.description || !form.date) {
        setToast({ type: 'error', message: 'Please fill amount, description and date.' })
        return
      }

      setIsUpdateConfirmOpen(true)
      return
    }

    await submitExpense({ isEdit: false })
  }

  const onEdit = (expense) => {
    setIsUpdateConfirmOpen(false)
    setEditingId(expense._id)
    setForm({
      amount: String(expense.amount),
      description: expense.text || '',
      category: expense.category || 'General',
      date: new Date(expense.createdAt).toISOString().slice(0, 10),
    })
  }

  const onDelete = async (expenseId) => {
    setIsSubmitting(true)
    try {
      await apiRequest(`/expenses/${expenseId}`, { method: 'DELETE' })
      handleSuccess(setToast, 'Expense deleted successfully')
      if (editingId === expenseId) {
        resetForm()
      }
      setIsLoading(true)
      await loadExpenses()
    } catch (error) {
      handleError(setToast, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteConfirmation = (expense) => {
    setExpenseToDelete(expense)
  }

  const closeDeleteConfirmation = () => {
    setExpenseToDelete(null)
  }

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete?._id) {
      return
    }

    await onDelete(expenseToDelete._id)
    closeDeleteConfirmation()
  }

  const closeUpdateConfirmation = () => {
    setIsUpdateConfirmOpen(false)
  }

  const confirmUpdateExpense = async () => {
    setIsUpdateConfirmOpen(false)
    await submitExpense({ isEdit: true })
  }

  const onExportCsv = () => {
    if (filteredExpenses.length === 0) {
      setToast({ type: 'error', message: 'No expenses to export.' })
      return
    }

    const rows = [
      ['Description', 'Category', 'Amount', 'Date'],
      ...filteredExpenses.map((expense) => [
        String(expense.text || '').replaceAll(',', ' '),
        String(expense.category || 'General').replaceAll(',', ' '),
        Number(expense.amount || 0).toFixed(2),
        new Date(expense.createdAt).toISOString().slice(0, 10),
      ]),
    ]

    const csvContent = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const onClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setDateFrom('')
    setDateTo('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <section className="expense-page">
      {(isLoading || isSubmitting) && (
        <FullPageLoader label={isLoading ? 'Loading expenses...' : 'Saving changes...'} />
      )}

      <ConfirmationModal
        open={Boolean(expenseToDelete)}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${expenseToDelete?.text || 'this expense'}?`}
        confirmText="Yes, Delete"
        onConfirm={confirmDeleteExpense}
        onCancel={closeDeleteConfirmation}
        danger
        disabled={isSubmitting}
      />

      <ConfirmationModal
        open={Boolean(editingId) && isUpdateConfirmOpen}
        title="Confirm Expense Update"
        message={`Update this expense with the current changes: ${form.description || 'expense details'}?`}
        confirmText="Yes, Update"
        onConfirm={confirmUpdateExpense}
        onCancel={closeUpdateConfirmation}
        disabled={isSubmitting}
      />

      <header className="expense-header">
        <h1>
          <i className="fa-solid fa-receipt" aria-hidden="true" /> Manage Your Expenses
        </h1>
        <p>Add, edit, and manage all your expenses in one place.</p>
      </header>

      <div className="expense-content-grid">
        <div className="expense-panel">
          <h3>
            <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> {editingId ? 'Edit Expense' : 'Add Expense'}
          </h3>
          <form className="expense-form" onSubmit={onSubmit}>
            <label>
              Amount
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Description
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="e.g. Grocery, Transport"
                required
              />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={onChange}>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input type="date" name="date" value={form.date} onChange={onChange} required />
            </label>
            <div className="expense-form-actions">
              <button className="db-btn db-btn-primary" type="submit" disabled={isSubmitting}>
                {editingId ? 'Update Expense' : 'Add Expense'}
              </button>
              {editingId && (
                <button className="db-btn db-btn-soft" type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="expense-panel">
          <h3>
            <i className="fa-solid fa-list-check" aria-hidden="true" /> All Expenses
          </h3>
          <div className="expense-toolbar">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by description..."
            />
            <select
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="All">All Categories</option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => {
                setDateFrom(event.target.value)
                setCurrentPage(1)
              }}
              aria-label="Start date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(event) => {
                setDateTo(event.target.value)
                setCurrentPage(1)
              }}
              aria-label="End date"
            />
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setCurrentPage(1)
              }}
              aria-label="Sort expenses"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            <button type="button" className="db-btn db-btn-soft" onClick={onExportCsv}>
              <i className="fa-solid fa-file-csv" aria-hidden="true" /> Export CSV
            </button>
            <button type="button" className="db-btn db-btn-soft" onClick={onClearFilters}>
              <i className="fa-solid fa-rotate-left" aria-hidden="true" /> Clear
            </button>
          </div>

          <p className="expense-results-info">
            Showing {sortedExpenses.length} result{sortedExpenses.length === 1 ? '' : 's'} out of {expenses.length}
            {filteredTotalAmount > 0 && (
              <span className="expense-total">
                • Total: {currencySymbol} {filteredTotalAmount.toFixed(2)}
              </span>
            )}
          </p>

          {topCategories.length > 0 && (
            <div className="expense-top-categories">
              {topCategories.map(([category, amount]) => (
                <div key={category} className="top-category-item">
                  <span>{category}</span>
                  <strong>
                    {currencySymbol} {Number(amount).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          )}

          {categoryBreakdown.length > 0 && (
            <div className="category-breakdown-wrap">
              {categoryBreakdown.map((entry) => (
                <div key={entry.category} className="category-breakdown-row">
                  <div className="category-breakdown-head">
                    <span>{entry.category}</span>
                    <strong>
                      {currencySymbol} {entry.amount.toFixed(2)}
                    </strong>
                  </div>
                  <div className="category-breakdown-bar">
                    <div style={{ width: `${entry.percentage.toFixed(2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading ? (
            null
          ) : sortedExpenses.length === 0 ? (
            <p className="no-expenses-message">No expenses found. Add your first one.</p>
          ) : (
            <div className="expense-list-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.text}</td>
                      <td>{expense.category || 'General'}</td>
                      <td>
                        {currencySymbol} {Number(expense.amount).toFixed(2)}
                      </td>
                      <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                      <td className="expense-actions-cell">
                        <button className="db-btn db-btn-soft" onClick={() => onEdit(expense)} type="button">
                          <i className="fa-solid fa-pen" aria-hidden="true" /> Edit
                        </button>
                        <button
                          className="db-btn db-btn-danger"
                          onClick={() => openDeleteConfirmation(expense)}
                          disabled={isSubmitting}
                          type="button"
                        >
                          <i className="fa-solid fa-trash" aria-hidden="true" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="expense-pagination">
                  <button
                    type="button"
                    className="db-btn db-btn-soft"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={safeCurrentPage === 1}
                  >
                    Prev
                  </button>
                  <span>
                    Page {safeCurrentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="db-btn db-btn-soft"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Expense
