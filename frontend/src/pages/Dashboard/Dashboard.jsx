import { useCallback, useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import { getCurrencySymbol } from '../../utils/currency'
import './Dashboard.css'

const EXPENSE_CATEGORIES = ['General', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Travel', 'Other']

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CHART_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#A9DFBF']

const Dashboard = ({ user, setToast }) => {
  const currencySymbol = getCurrencySymbol(user?.currency)
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [budgetInput, setBudgetInput] = useState('')
  const [isSavingBudget, setIsSavingBudget] = useState(false)
  const [spendingGoals, setSpendingGoals] = useState([])
  const [categoryBudgets, setCategoryBudgets] = useState([])
  const [newGoalCategory, setNewGoalCategory] = useState('General')
  const [newGoalLimit, setNewGoalLimit] = useState('')
  const [isSavingGoal, setIsSavingGoal] = useState(false)

  const isRouteNotAvailableError = useCallback((error) => {
    const message = String(error?.message || '').toLowerCase()
    return message.includes('cannot get') || message.includes('cannot put') || message.includes('not found')
  }, [])

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

  const loadBudget = useCallback(async () => {
    try {
      const data = await apiRequest('/budget')
      const budget = data?.monthlyBudget || 0
      setMonthlyBudget(budget)
      setBudgetInput(String(budget))
    } catch (error) {
      setMonthlyBudget(0)
      setBudgetInput('0')
      if (!isRouteNotAvailableError(error)) {
        handleError(setToast, error)
      }
    }
  }, [isRouteNotAvailableError, setToast])

  const loadGoals = useCallback(async () => {
    try {
      const data = await apiRequest('/goals')
      setSpendingGoals(data?.spendingGoals || [])
      setCategoryBudgets(data?.categoryBudgets || [])
    } catch (error) {
      setSpendingGoals([])
      setCategoryBudgets([])
      if (!isRouteNotAvailableError(error)) {
        handleError(setToast, error)
      }
    }
  }, [isRouteNotAvailableError, setToast])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadExpenses()
      loadBudget()
      loadGoals()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadExpenses, loadBudget, loadGoals])

  const counts = useMemo(() => {
    const totalItems = expenses.length
    const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    const monthExpenses = expenses.filter((exp) => {
      const date = new Date(exp.createdAt)
      return date.getMonth() === month && date.getFullYear() === year
    })

    const thisMonth = monthExpenses.length
    const thisMonthAmount = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)

    return { totalItems, totalAmount, thisMonth, thisMonthAmount }
  }, [expenses])

  const analytics = useMemo(() => {
    const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    const averageAmount = expenses.length ? totalAmount / expenses.length : 0
    const largestExpense = expenses.reduce((largest, expense) => {
      if (!largest || Number(expense.amount || 0) > Number(largest.amount || 0)) {
        return expense
      }
      return largest
    }, null)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const last7DaysAmount = expenses
      .filter((expense) => new Date(expense.createdAt) >= sevenDaysAgo)
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

    return { averageAmount, largestExpense, last7DaysAmount }
  }, [expenses])

  const weeklyTrend = useMemo(() => {
    const totals = new Array(7).fill(0)

    expenses.forEach((expense) => {
      const dayIndex = new Date(expense.createdAt).getDay()
      totals[dayIndex] += Number(expense.amount || 0)
    })

    const maxAmount = Math.max(...totals, 0)

    return WEEKDAY_LABELS.map((label, index) => ({
      label,
      amount: totals[index],
      width: maxAmount > 0 ? (totals[index] / maxAmount) * 100 : 0,
    }))
  }, [expenses])

  const pieChartData = useMemo(() => {
    const map = new Map()
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

    expenses.forEach((expense) => {
      const category = expense.category || 'General'
      map.set(category, (map.get(category) || 0) + Number(expense.amount || 0))
    })

    return Array.from(map.entries())
      .map(([name, value], index) => ({
        name,
        value: parseFloat(value.toFixed(2)),
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const monthlyTrendData = useMemo(() => {
    const map = new Map()
    const today = new Date()
    const currentYear = today.getFullYear()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, today.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = date.getMonth()
      const key = `${year}-${month}`
      map.set(key, 0)
    }

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (map.has(key)) {
        map.set(key, map.get(key) + Number(expense.amount || 0))
      }
    })

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return Array.from(map.entries()).map(([key, amount]) => {
      const [year, month] = key.split('-').map(Number)
      const monthName = monthNames[month]
      return {
        name: `${monthName} '${year.toString().slice(-2)}`,
        amount: parseFloat(amount.toFixed(2)),
      }
    })
  }, [expenses])

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [expenses])

  const budgetProgress = monthlyBudget > 0
    ? Math.min((counts.thisMonthAmount / monthlyBudget) * 100, 100)
    : 0

  const topSpendingDay = useMemo(() => {
    if (expenses.length === 0) return null
    return expenses.reduce((max, expense) => {
      const currentAmount = Number(expense.amount || 0)
      const maxAmount = Number(max?.amount || 0)
      return currentAmount > maxAmount ? expense : max
    })
  }, [expenses])
  const topSpendingCategories = useMemo(() => {
    const categoryTotals = new Map()
    expenses.forEach((expense) => {
      const category = expense.category || 'General'
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + Number(expense.amount || 0))
    })
    return Array.from(categoryTotals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }, [expenses])
  const dailyAverageBreakdown = useMemo(() => {
    if (expenses.length === 0) return 0
    const daysWithExpenses = new Set()
    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt).toLocaleDateString()
      daysWithExpenses.add(date)
    })
    const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    return daysWithExpenses.size > 0 ? totalAmount / daysWithExpenses.size : 0
  }, [expenses])
  const quickStats = useMemo(() => {
    const today = new Date()
    const yearStart = new Date(today.getFullYear(), 0, 1)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const yearToDate = expenses.filter(exp => new Date(exp.createdAt) >= yearStart)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    const last30Days = expenses.filter(exp => new Date(exp.createdAt) >= thirtyDaysAgo)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    const last7Days = expenses.filter(exp => new Date(exp.createdAt) >= sevenDaysAgo)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0)

    return {
      yearToDate,
      last30Days,
      last7Days,
      yearToDateCount: yearToDate > 0 ? expenses.filter(exp => new Date(exp.createdAt) >= yearStart).length : 0,
      last30DaysCount: last30Days > 0 ? expenses.filter(exp => new Date(exp.createdAt) >= thirtyDaysAgo).length : 0,
    }
  }, [expenses])
  const spendingVelocity = useMemo(() => {
    const today = new Date()
    const currentWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const previousWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)

    const currentWeekAmount = expenses.filter(exp => new Date(exp.createdAt) >= currentWeek)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    const previousWeekAmount = expenses.filter(exp => {
      const expDate = new Date(exp.createdAt)
      return expDate >= previousWeek && expDate < currentWeek
    }).reduce((sum, exp) => sum + Number(exp.amount || 0), 0)

    let trend = 'stable'
    let change = 0
    if (previousWeekAmount > 0) {
      change = ((currentWeekAmount - previousWeekAmount) / previousWeekAmount) * 100
      if (change > 10) trend = 'increasing'
      else if (change < -10) trend = 'decreasing'
    } else if (currentWeekAmount > 0) {
      trend = 'increasing'
      change = 100
    }

    return { trend, change, currentWeekAmount, previousWeekAmount }
  }, [expenses])
  const monthOverMonthComparison = useMemo(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const thisMonthExpenses = expenses.filter((exp) => {
      const date = new Date(exp.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).reduce((sum, exp) => sum + Number(exp.amount || 0), 0)

    let previousMonthExpenses = 0
    if (currentMonth === 0) {
      previousMonthExpenses = expenses.filter((exp) => {
        const date = new Date(exp.createdAt)
        return date.getMonth() === 11 && date.getFullYear() === currentYear - 1
      }).reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    } else {
      previousMonthExpenses = expenses.filter((exp) => {
        const date = new Date(exp.createdAt)
        return date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear
      }).reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    }

    let change = 0
    if (previousMonthExpenses > 0) {
      change = ((thisMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    }

    return { thisMonth: thisMonthExpenses, previousMonth: previousMonthExpenses, change }
  }, [expenses])
  const budgetAlert = useMemo(() => {
    const isExceeded = monthlyBudget > 0 && counts.thisMonthAmount > monthlyBudget
    const remaining = monthlyBudget - counts.thisMonthAmount
    const percentage = monthlyBudget > 0 ? (counts.thisMonthAmount / monthlyBudget) * 100 : 0

    return {
      isExceeded,
      remaining: Math.max(remaining, 0),
      percentage: Math.min(percentage, 100),
      alertMessage: isExceeded ? `Budget exceeded by ${currencySymbol} ${Math.abs(remaining).toFixed(2)}` : null
    }
  }, [monthlyBudget, counts.thisMonthAmount, currencySymbol])
  const categorySpending = useMemo(() => {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    const categoryTotals = new Map()
    expenses
      .filter((exp) => {
        const date = new Date(exp.createdAt)
        return date.getMonth() === month && date.getFullYear() === year
      })
      .forEach((expense) => {
        const category = expense.category || 'General'
        categoryTotals.set(category, (categoryTotals.get(category) || 0) + Number(expense.amount || 0))
      })

    return Array.from(categoryTotals.entries())
      .map(([category, spent]) => {
        const budget = categoryBudgets.find(b => b.category === category)?.budget || 0
        const goal = spendingGoals.find(g => g.category === category)?.limit || 0
        return {
          category,
          spent,
          budget,
          goal,
          isOverBudget: budget > 0 && spent > budget,
          isOverGoal: goal > 0 && spent > goal
        }
      })
      .sort((a, b) => b.spent - a.spent)
  }, [expenses, categoryBudgets, spendingGoals])

  const onSaveBudget = async (event) => {
    event.preventDefault()

    const nextBudget = Number(budgetInput)

    if (!Number.isFinite(nextBudget) || nextBudget < 0) {
      setToast({ type: 'error', message: 'Enter a valid monthly budget amount.' })
      return
    }

    setIsSavingBudget(true)
    try {
      const data = await apiRequest('/budget', {
        method: 'PUT',
        body: JSON.stringify({ monthlyBudget: nextBudget }),
      })
      setMonthlyBudget(data?.monthlyBudget || nextBudget)
      handleSuccess(setToast, 'Monthly budget saved')
    } catch (error) {
      handleError(setToast, error)
      setBudgetInput(String(monthlyBudget))
    } finally {
      setIsSavingBudget(false)
    }
  }

  const onAddSpendingGoal = async (event) => {
    event.preventDefault()

    const limit = Number(newGoalLimit)
    if (!Number.isFinite(limit) || limit <= 0) {
      setToast({ type: 'error', message: 'Enter a valid spending limit.' })
      return
    }

    setIsSavingGoal(true)
    try {
      const data = await apiRequest('/goals', {
        method: 'POST',
        body: JSON.stringify({ category: newGoalCategory, limit }),
      })
      setSpendingGoals(data?.spendingGoals || [])
      setNewGoalLimit('')
      handleSuccess(setToast, 'Spending goal added')
    } catch (error) {
      handleError(setToast, error)
    } finally {
      setIsSavingGoal(false)
    }
  }

  const onDeleteSpendingGoal = async (category) => {
    try {
      const data = await apiRequest('/goals', {
        method: 'DELETE',
        body: JSON.stringify({ category }),
      })
      setSpendingGoals(data?.spendingGoals || [])
      handleSuccess(setToast, 'Spending goal deleted')
    } catch (error) {
      handleError(setToast, error)
    }
  }

  return (
    <section className="dashboard-page">
      {isLoading && (
        <FullPageLoader label="Loading expenses..." />
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
            {currencySymbol} {counts.totalAmount.toFixed(2)}
          </p>
        </article>
        <article className="dashboard-count-card">
          <i className="fa-solid fa-calendar" aria-hidden="true" />
          <h4>This Month</h4>
          <p>{counts.thisMonth}</p>
        </article>
        <article className="dashboard-count-card">
          <i className="fa-solid fa-filter-circle-dollar" aria-hidden="true" />
          <h4>This Month Spent</h4>
          <p>
            {currencySymbol} {counts.thisMonthAmount.toFixed(2)}
          </p>
        </article>
      </div>

      <div className="dashboard-insights-grid">
        <article className="dashboard-panel">
          <h3>
            <i className="fa-solid fa-bullseye" aria-hidden="true" /> Monthly Budget
          </h3>

          <form className="budget-form" onSubmit={onSaveBudget}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={budgetInput}
              onChange={(event) => setBudgetInput(event.target.value)}
              placeholder="Set budget amount"
              disabled={isSavingBudget}
            />
            <button type="submit" className="db-btn db-btn-primary" disabled={isSavingBudget}>
              {isSavingBudget ? 'Saving...' : 'Save Budget'}
            </button>
          </form>

          <div className="budget-progress">
            <div className="budget-progress-track">
              <div className="budget-progress-fill" style={{ width: `${budgetProgress}%` }} />
            </div>
            <div className="budget-progress-text">
              <span>
                Spent this month: {currencySymbol} {counts.thisMonthAmount.toFixed(2)}
              </span>
              <strong>
                Budget: {monthlyBudget > 0 ? `${currencySymbol} ${monthlyBudget.toFixed(2)}` : 'Not set'}
              </strong>
            </div>
          </div>

          {budgetAlert.alertMessage && (
            <div className="alert alert-warning">
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> {budgetAlert.alertMessage}
            </div>
          )}

          {monthlyBudget > 0 && (
            <div className="budget-remaining">
              <p>
                <strong>Budget Remaining:</strong> {currencySymbol} {budgetAlert.remaining.toFixed(2)}
              </p>
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <h3>
            <i className="fa-solid fa-lightbulb" aria-hidden="true" /> Quick Insights
          </h3>
          <div className="insight-grid">
            <div className="insight-card">
              <span>Average Expense</span>
              <strong>
                {currencySymbol} {analytics.averageAmount.toFixed(2)}
              </strong>
            </div>
            <div className="insight-card">
              <span>Last 7 Days</span>
              <strong>
                {currencySymbol} {analytics.last7DaysAmount.toFixed(2)}
              </strong>
            </div>
            <div className="insight-card">
              <span>Largest Expense</span>
              <strong>
                {currencySymbol} {Number(analytics.largestExpense?.amount || 0).toFixed(2)}
              </strong>
            </div>
          </div>

          {weeklyTrend.some((entry) => entry.amount > 0) && (
            <div className="weekday-trend">
              {weeklyTrend.map((entry) => (
                <div key={entry.label} className="weekday-row">
                  <span>{entry.label}</span>
                  <div className="weekday-bar-track">
                    <div className="weekday-bar-fill" style={{ width: `${entry.width}%` }} />
                  </div>
                  <strong>
                    {currencySymbol} {entry.amount.toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="dashboard-charts-grid">
        {pieChartData.length > 0 && (
          <article className="dashboard-panel chart-panel">
            <h3>
              <i className="fa-solid fa-pie-chart" aria-hidden="true" /> Category Distribution
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${currencySymbol} ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pie-legend">
              {pieChartData.map((entry) => (
                <div key={entry.name} className="pie-legend-item">
                  <span className="pie-color" style={{ backgroundColor: entry.fill }} />
                  <span>{entry.name}</span>
                  <strong>{currencySymbol} {entry.value.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>
        )}

        {monthlyTrendData.some((m) => m.amount > 0) && (
          <article className="dashboard-panel chart-panel">
            <h3>
              <i className="fa-solid fa-chart-line" aria-hidden="true" /> Monthly Spending Trend
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${currencySymbol} ${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="amount" fill="#45B7D1" name="Amount Spent" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        )}
      </div>

      <div className="dashboard-features-grid">
        <article className="dashboard-panel stats-panel">
          <h3>
            <i className="fa-solid fa-chart-bar" aria-hidden="true" /> Quick Stats Summary
          </h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span>Year-to-Date</span>
              <strong>{currencySymbol} {quickStats.yearToDate.toFixed(2)}</strong>
              <small>{quickStats.yearToDateCount} expenses</small>
            </div>
            <div className="stat-item">
              <span>Last 30 Days</span>
              <strong>{currencySymbol} {quickStats.last30Days.toFixed(2)}</strong>
              <small>{quickStats.last30DaysCount} expenses</small>
            </div>
            <div className="stat-item">
              <span>Last 7 Days</span>
              <strong>{currencySymbol} {quickStats.last7Days.toFixed(2)}</strong>
              <small>Daily avg: {currencySymbol} {(quickStats.last7Days / 7).toFixed(2)}</small>
            </div>
          </div>
        </article>
        {topSpendingCategories.length > 0 && (
          <article className="dashboard-panel top-categories-panel">
            <h3>
              <i className="fa-solid fa-fire" aria-hidden="true" /> Top Spending Categories
            </h3>
            <div className="top-categories-list">
              {topSpendingCategories.map((cat, index) => (
                <div key={cat.name} className="top-category-item">
                  <span className="category-rank">#{index + 1}</span>
                  <span className="category-name">{cat.name}</span>
                  <strong>{currencySymbol} {cat.value.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>
        )}
        <article className="dashboard-panel velocity-panel">
          <h3>
            <i className="fa-solid fa-gauge" aria-hidden="true" /> Spending Velocity
          </h3>
          <div className="velocity-content">
            <div className={`velocity-indicator ${spendingVelocity.trend}`}>
              <i className={`fa-solid ${spendingVelocity.trend === 'increasing' ? 'fa-arrow-trend-up' : spendingVelocity.trend === 'decreasing' ? 'fa-arrow-trend-down' : 'fa-arrow-right'}`} aria-hidden="true" />
              <span>{spendingVelocity.trend === 'increasing' ? 'Increasing' : spendingVelocity.trend === 'decreasing' ? 'Decreasing' : 'Stable'}</span>
            </div>
            <div className="velocity-stats">
              <p>This week vs Last week: <strong>{spendingVelocity.change >= 0 ? '+' : ''}{spendingVelocity.change.toFixed(1)}%</strong></p>
              <p>Current: {currencySymbol} {spendingVelocity.currentWeekAmount.toFixed(2)}</p>
            </div>
          </div>
        </article>
        <article className="dashboard-panel mom-panel">
          <h3>
            <i className="fa-solid fa-arrows-left-right" aria-hidden="true" /> Month-over-Month
          </h3>
          <div className="mom-content">
            <div className="mom-item">
              <span>This Month</span>
              <strong>{currencySymbol} {monthOverMonthComparison.thisMonth.toFixed(2)}</strong>
            </div>
            <div className="mom-change">
              <i className={`fa-solid ${monthOverMonthComparison.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`} aria-hidden="true" />
              <span>{monthOverMonthComparison.change >= 0 ? '+' : ''}{monthOverMonthComparison.change.toFixed(1)}%</span>
            </div>
            <div className="mom-item">
              <span>Last Month</span>
              <strong>{currencySymbol} {monthOverMonthComparison.previousMonth.toFixed(2)}</strong>
            </div>
          </div>
        </article>
        <article className="dashboard-panel daily-avg-panel">
          <h3>
            <i className="fa-solid fa-calendar-days" aria-hidden="true" /> Daily Average
          </h3>
          <div className="daily-avg-content">
            <strong className="daily-avg-amount">{currencySymbol} {dailyAverageBreakdown.toFixed(2)}</strong>
            <p>Per day across all expense days</p>
          </div>
        </article>
        <article className="dashboard-panel goals-panel">
          <h3>
            <i className="fa-solid fa-bullseye" aria-hidden="true" /> Spending Goals
          </h3>
          <form onSubmit={onAddSpendingGoal} className="goal-form">
            <select value={newGoalCategory} onChange={(e) => setNewGoalCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newGoalLimit}
              onChange={(e) => setNewGoalLimit(e.target.value)}
              placeholder="Goal limit"
              disabled={isSavingGoal}
            />
            <button type="submit" className="db-btn db-btn-primary" disabled={isSavingGoal}>
              Add Goal
            </button>
          </form>

          {spendingGoals.length > 0 && (
            <div className="goals-list">
              {spendingGoals.map((goal) => (
                <div key={goal.category} className="goal-item">
                  <span>{goal.category}</span>
                  <strong>{currencySymbol} {goal.limit.toFixed(2)}</strong>
                  <button 
                    className="db-btn db-btn-danger db-btn-sm"
                    onClick={() => onDeleteSpendingGoal(goal.category)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>
        {categorySpending.length > 0 && (
          <article className="dashboard-panel category-budget-panel">
            <h3>
              <i className="fa-solid fa-sitemap" aria-hidden="true" /> Category Breakdown
            </h3>
            <div className="category-budget-list">
              {categorySpending.map((cat) => (
                <div key={cat.category} className={`category-budget-item ${cat.isOverBudget ? 'over-budget' : ''} ${cat.isOverGoal ? 'over-goal' : ''}`}>
                  <div className="category-info">
                    <span className="cat-name">{cat.category}</span>
                    <span className="cat-spent">{currencySymbol} {cat.spent.toFixed(2)}</span>
                  </div>
                  {(cat.budget > 0 || cat.goal > 0) && (
                    <div className="category-limits">
                      {cat.budget > 0 && (
                        <small>Budget: {currencySymbol} {cat.budget.toFixed(2)} {cat.isOverBudget && '⚠️'}</small>
                      )}
                      {cat.goal > 0 && (
                        <small>Goal: {currencySymbol} {cat.goal.toFixed(2)} {cat.isOverGoal && '⚠️'}</small>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
        )}
      </div>

      <article className="dashboard-panel additional-insights">
        <h3>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" /> Additional Insights
        </h3>
        <div className="insights-row">
          <div className="insight-stat">
            <span>Total Categories</span>
            <strong className="stat-number">{pieChartData.length}</strong>
          </div>
          <div className="insight-stat">
            <span>Highest Spending Category</span>
            <strong className="stat-name">{pieChartData[0]?.name || 'N/A'}</strong>
          </div>
          {topSpendingDay && (
            <div className="insight-stat">
              <span>Largest Single Expense</span>
              <strong className="stat-name">{topSpendingDay.text || 'N/A'}</strong>
            </div>
          )}
          <div className="insight-stat">
            <span>Average Daily Spending</span>
            <strong className="stat-number">
              {currencySymbol} {
                expenses.length > 0 
                  ? (expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0) / Math.max(1, expenses.length)).toFixed(2)
                  : '0.00'
              }
            </strong>
          </div>
        </div>
      </article>

      {recentExpenses.length > 0 && (
        <div className="dashboard-panel recent-expenses-panel">
          <h3>
            <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" /> Recent Activity
          </h3>
          <div className="recent-expenses-list">
            {recentExpenses.map((expense) => (
              <article key={expense._id} className="recent-expense-item">
                <div>
                  <strong>{expense.text || 'Expense'}</strong>
                  <p>{new Date(expense.createdAt).toLocaleDateString()}</p>
                </div>
                <span>{expense.category || 'General'}</span>
                <strong>
                  {currencySymbol} {Number(expense.amount || 0).toFixed(2)}
                </strong>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Dashboard