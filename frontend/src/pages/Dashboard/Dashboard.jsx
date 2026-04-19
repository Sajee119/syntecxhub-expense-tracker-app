import { useCallback, useEffect, useMemo, useState } from 'react'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import './Dashboard.css'

const initialExpenseForm = {
  amount: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
}

const Dashboard = ({ user, setToast }) => {
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState(initialExpenseForm)
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const counts = useMemo(() => {
    const totalItems = expenses.length
    const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    const thisMonth = expenses.filter((exp) => {
      const date = new Date(exp.createdAt)
      return date.getMonth() === month && date.getFullYear() === year
    }).length

    return { totalItems, totalAmount, thisMonth }
  }, [expenses])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setForm(initialExpenseForm)
    setEditingId(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!form.amount || !form.description || !form.date) {
      setToast({ type: 'error', message: 'Please fill amount, description and date.' })
      return
    }

    const payload = {
      amount: Number(form.amount),
      description: form.description,
      date: form.date,
    }

    setIsSubmitting(true)
    try {
      if (editingId) {
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

  const onEdit = (expense) => {
    setEditingId(expense._id)
    setForm({
      amount: String(expense.amount),
      description: expense.text || '',
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

  return (
    <section className="dashboard-page">
      {(isLoading || isSubmitting) && (
        <FullPageLoader label={isLoading ? 'Loading expenses...' : 'Saving changes...'} />
      )}
      <header className="dashboard-header">
        <h1>
          <i className="fa-solid fa-chart-column" aria-hidden="true" /> Hi {user?.name || 'User'}, here is your dashboard
        </h1>
        <p>Track every expense and keep your monthly spending under control.</p>
      </header>

      <div className="dashboard-count-grid">
        <article className="dashboard-count-card">
          <i className="fa-solid fa-list" aria-hidden="true" />
          <h4>Total Entries</h4>
          <p>{counts.totalItems}</p>
        </article>
        <article className="dashboard-count-card">
          <i className="fa-solid fa-dollar-sign" aria-hidden="true" />
          <h4>Total Spent</h4>
          <p>
            {user?.currency || 'USD'} {counts.totalAmount.toFixed(2)}
          </p>
        </article>
        <article className="dashboard-count-card">
          <i className="fa-solid fa-calendar" aria-hidden="true" />
          <h4>This Month</h4>
          <p>{counts.thisMonth}</p>
        </article>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-panel">
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

        <div className="dashboard-panel">
          <h3>
            <i className="fa-solid fa-list-check" aria-hidden="true" /> All Expenses
          </h3>
          {isLoading ? (
            null
          ) : expenses.length === 0 ? (
            <p>No expenses found. Add your first one.</p>
          ) : (
            <div className="expense-list-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.text}</td>
                      <td>
                        {user?.currency || 'USD'} {Number(expense.amount).toFixed(2)}
                      </td>
                      <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                      <td className="expense-actions-cell">
                        <button className="db-btn db-btn-soft" onClick={() => onEdit(expense)} type="button">
                          <i className="fa-solid fa-pen" aria-hidden="true" /> Edit
                        </button>
                        <button
                          className="db-btn db-btn-danger"
                          onClick={() => onDelete(expense._id)}
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Dashboard