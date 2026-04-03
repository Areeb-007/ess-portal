import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

const COMP_TYPES = ['Salary Adjustment', 'Performance Bonus', 'Annual Increment', 'Allowance', 'Overtime Pay', 'Commission', 'Other']

const EMPTY_FORM = { type: 'Performance Bonus', amount: '', date: '', notes: '', currency: 'PKR' }

export default function Compensation() {
  const { state, dispatch } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  const total = state.compensations.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const thisYear = state.compensations.filter(c => c.date?.startsWith('2026'))
  const yearTotal = thisYear.reduce((sum, c) => sum + Number(c.amount || 0), 0)

  function handleSubmit() {
    if (!form.amount || !form.date) return
    dispatch({
      type: 'ADD_COMPENSATION',
      payload: { ...form, id: Date.now() }
    })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const TYPE_COLORS = {
    'Salary Adjustment': 'blue',
    'Performance Bonus': 'emerald',
    'Annual Increment': 'purple',
    'Allowance': 'amber',
    'Overtime Pay': 'orange',
    'Commission': 'pink',
    'Other': 'slate',
  }

  function getTypeBadge(type) {
    const color = TYPE_COLORS[type] || 'slate'
    return `bg-${color}-500/20 text-${color}-300 border border-${color}-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold`
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Compensation</h1>
          <p className="text-slate-400 text-sm mt-1">Track your salary adjustments, bonuses, and allowances</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Record
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Total Records</div>
              <div className="text-white font-bold text-lg">{state.compensations.length}</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Total Amount</div>
              <div className="text-white font-bold text-lg">PKR {total.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs">2026 Total</div>
              <div className="text-white font-bold text-lg">PKR {yearTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Add Compensation Record</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                {COMP_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">PKR</span>
                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  className="input-field pl-14"
                />
              </div>
            </div>
            <div>
              <label className="label-text">Effective Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Additional notes or context..."
                rows={2}
                className="input-field resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="btn-primary">Add Record</button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Records */}
      {state.compensations.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No compensation records yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">Add your first record</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Compensation Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {['Date', 'Type', 'Amount (PKR)', 'Notes', ''].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...state.compensations].sort((a, b) => b.date.localeCompare(a.date)).map(c => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                      {new Date(c.date + 'T00:00:00').toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={getTypeBadge(c.type)}>{c.type}</span>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{Number(c.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">{c.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => dispatch({ type: 'DELETE_COMPENSATION', payload: c.id })} className="btn-danger text-xs px-2 py-1">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
