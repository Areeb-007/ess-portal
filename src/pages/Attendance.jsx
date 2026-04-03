import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Half Day', 'Work From Home', 'On Leave']
const EMPTY_FORM = { date: '', checkIn: '', checkOut: '', status: 'Present' }

export default function Attendance() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterMonth, setFilterMonth] = useState('')

  const sorted = [...state.attendance].sort((a, b) => b.date.localeCompare(a.date))

  const filtered = sorted.filter(a => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false
    if (filterMonth && !a.date.startsWith(filterMonth)) return false
    return true
  })

  const presentCount = state.attendance.filter(a => a.status === 'Present').length
  const absentCount = state.attendance.filter(a => a.status === 'Absent').length
  const lateCount = state.attendance.filter(a => a.status === 'Late').length

  function handleSubmit() {
    if (!form.date) return
    if (editId !== null) {
      dispatch({ type: 'UPDATE_ATTENDANCE', payload: { ...form, id: editId, missingPunchRequested: false } })
      setEditId(null)
    } else {
      dispatch({
        type: 'ADD_ATTENDANCE',
        payload: { ...form, id: Date.now(), missingPunchRequested: false }
      })
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function startEdit(record) {
    setForm({ date: record.date, checkIn: record.checkIn || '', checkOut: record.checkOut || '', status: record.status || 'Present' })
    setEditId(record.id)
    setShowForm(true)
  }

  function cancelForm() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(false)
  }

  function statusBadge(status) {
    switch (status) {
      case 'Present': return 'badge-approved'
      case 'Absent': return 'badge-rejected'
      case 'Late': return 'badge-pending'
      case 'Half Day': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold'
      case 'Work From Home': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold'
      case 'On Leave': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold'
      default: return 'badge-pending'
    }
  }

  // Get unique months for filter
  const months = [...new Set(state.attendance.map(a => a.date.slice(0, 7)))].sort().reverse()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Previous Attendance</h1>
          <p className="text-slate-400 text-sm mt-1">View and manage attendance history</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{state.attendance.length}</div>
          <div className="text-slate-400 text-xs mt-1">Total Days</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{presentCount}</div>
          <div className="text-slate-400 text-xs mt-1">Present</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{absentCount}</div>
          <div className="text-slate-400 text-xs mt-1">Absent</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{lateCount}</div>
          <div className="text-slate-400 text-xs mt-1">Late</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">{editId ? 'Edit Record' : 'Add Attendance Record'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-field">
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Check In Time</label>
              <input type="text" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} placeholder="e.g. 09:00 AM" className="input-field" />
            </div>
            <div>
              <label className="label-text">Check Out Time</label>
              <input type="text" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} placeholder="e.g. 06:00 PM" className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="btn-primary">{editId ? 'Update Record' : 'Add Record'}</button>
            <button onClick={cancelForm} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
        <div className="flex flex-wrap gap-2">
          {['All', 'Present', 'Absent', 'Late', 'Work From Home', 'On Leave'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="input-field text-sm py-1.5"
          >
            <option value="">All Months</option>
            {months.map(m => (
              <option key={m} value={m}>
                {new Date(m + '-01').toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <p>No attendance records found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {['Date', 'Day', 'Check In', 'Check Out', 'Status', 'Missing Punch', 'Actions'].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(record => (
                  <tr key={record.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{record.date}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-medium whitespace-nowrap">{record.checkIn || '—'}</td>
                    <td className="px-4 py-3 text-orange-400 font-medium whitespace-nowrap">{record.checkOut || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(record.status || 'Present')}>{record.status || 'Present'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {record.missingPunchRequested
                        ? <span className="badge-pending">Requested</span>
                        : <span className="text-slate-600 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(record)} className="btn-success text-xs px-2 py-1">Edit</button>
                        <button onClick={() => dispatch({ type: 'DELETE_ATTENDANCE', payload: record.id })} className="btn-danger text-xs px-2 py-1">Delete</button>
                      </div>
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
