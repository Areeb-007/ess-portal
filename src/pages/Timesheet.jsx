import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

const EMPTY_FORM = { date: '', hours: '', description: '', project: '' }

export default function Timesheet() {
  const { state, dispatch } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const totalHours = state.timesheet.reduce((sum, t) => sum + Number(t.hours || 0), 0)

  function handleSubmit() {
    if (!form.date || !form.hours) return
    if (editId !== null) {
      dispatch({ type: 'UPDATE_TIMESHEET', payload: { ...form, id: editId } })
      setEditId(null)
    } else {
      dispatch({ type: 'ADD_TIMESHEET', payload: { ...form, id: Date.now() } })
    }
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function startEdit(entry) {
    setForm({ date: entry.date, hours: entry.hours, description: entry.description, project: entry.project || '' })
    setEditId(entry.id)
    setShowForm(true)
  }

  function cancelForm() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Timesheet</h1>
          <p className="text-slate-400 text-sm mt-1">Log and manage your working hours</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Entry
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{state.timesheet.length}</div>
          <div className="text-slate-400 text-xs mt-1">Total Entries</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{totalHours.toFixed(1)}h</div>
          <div className="text-slate-400 text-xs mt-1">Total Hours Logged</div>
        </div>
        <div className="glass-card p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-purple-400">
            {state.timesheet.length ? (totalHours / state.timesheet.length).toFixed(1) : '0'}h
          </div>
          <div className="text-slate-400 text-xs mt-1">Avg Hours / Entry</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">{editId ? 'Edit Entry' : 'Add Timesheet Entry'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Hours Worked *</label>
              <input type="number" min="0.5" max="24" step="0.5" value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="e.g. 8" className="input-field" />
            </div>
            <div>
              <label className="label-text">Project / Task</label>
              <input type="text" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} placeholder="Project name or task" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="What did you work on?"
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="btn-primary">{editId ? 'Update Entry' : 'Add Entry'}</button>
            <button onClick={cancelForm} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      {state.timesheet.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No timesheet entries yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">Add your first entry</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Timesheet Entries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {['Date', 'Project / Task', 'Hours', 'Description', 'Actions'].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...state.timesheet].sort((a, b) => b.date.localeCompare(a.date)).map(entry => (
                  <tr key={entry.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs">{entry.project || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-lg text-xs font-semibold">
                        {entry.hours}h
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{entry.description || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(entry)} className="btn-success text-xs px-2 py-1">Edit</button>
                        <button onClick={() => dispatch({ type: 'DELETE_TIMESHEET', payload: entry.id })} className="btn-danger text-xs px-2 py-1">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-white/20">
                <tr>
                  <td className="px-4 py-3 text-slate-400 font-medium" colSpan={2}>Total</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-xs font-semibold">
                      {totalHours.toFixed(1)}h
                    </span>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
