import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

const REQUEST_TYPES = ['Leave', 'Remote Work Request', 'Missing Punch', 'Financial Claim', 'Business Trip']

const STATUS_CYCLE = { Pending: 'Approved', Approved: 'Rejected', Rejected: 'Pending' }

const TYPE_ICONS = {
  Leave: '🌴',
  'Remote Work Request': '🏠',
  'Missing Punch': '⏰',
  'Financial Claim': '💰',
  'Business Trip': '✈️',
}

function LeaveFields({ form, setForm }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Leave Type</label>
          <select value={form.leaveType || ''} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className="input-field">
            <option value="">Select type</option>
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Casual Leave</option>
            <option>Maternity Leave</option>
            <option>Paternity Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>
        <div>
          <label className="label-text">Start Date</label>
          <input type="date" value={form.startDate || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-text">End Date</label>
          <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-text">Number of Days</label>
          <input type="number" min="1" value={form.days || ''} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} placeholder="0" className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-text">Reason</label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Please state your reason..." className="input-field resize-none" />
      </div>
    </>
  )
}

function RemoteWorkFields({ form, setForm }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Start Date</label>
          <input type="date" value={form.startDate || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-text">End Date</label>
          <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-text">Reason / Justification</label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Why are you requesting remote work?" className="input-field resize-none" />
      </div>
    </>
  )
}

function MissingPunchFields({ form, setForm }) {
  return (
    <>
      <div>
        <label className="label-text">Date</label>
        <input type="date" value={form.date || ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
      </div>
      <div>
        <label className="label-text">Punch Type</label>
        <select value={form.punchType || ''} onChange={e => setForm(f => ({ ...f, punchType: e.target.value }))} className="input-field">
          <option value="">Select</option>
          <option>Check In</option>
          <option>Check Out</option>
          <option>Both</option>
        </select>
      </div>
      <div>
        <label className="label-text">Reason</label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Reason for missing punch..." className="input-field resize-none" />
      </div>
    </>
  )
}

function FinancialClaimFields({ form, setForm }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Claim Type</label>
          <select value={form.claimType || ''} onChange={e => setForm(f => ({ ...f, claimType: e.target.value }))} className="input-field">
            <option value="">Select</option>
            <option>Medical</option>
            <option>Travel</option>
            <option>Communication</option>
            <option>Equipment</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label-text">Amount (PKR)</label>
          <input type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="input-field" />
        </div>
        <div>
          <label className="label-text">Date of Expense</label>
          <input type="date" value={form.expenseDate || ''} onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-text">Description</label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Describe the expense..." className="input-field resize-none" />
      </div>
    </>
  )
}

function BusinessTripFields({ form, setForm }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Destination</label>
          <input type="text" value={form.destination || ''} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="City / Country" className="input-field" />
        </div>
        <div>
          <label className="label-text">Purpose</label>
          <input type="text" value={form.purpose || ''} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="Meeting, Conference, Training..." className="input-field" />
        </div>
        <div>
          <label className="label-text">Departure Date</label>
          <input type="date" value={form.startDate || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-text">Return Date</label>
          <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-text">Additional Notes</label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Any additional information..." className="input-field resize-none" />
      </div>
    </>
  )
}

export default function Requests() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [requestType, setRequestType] = useState('Leave')
  const [form, setForm] = useState({})
  const [filter, setFilter] = useState('All')

  function openModal() {
    setForm({})
    setRequestType('Leave')
    setShowModal(true)
  }

  function submitRequest() {
    dispatch({
      type: 'ADD_REQUEST',
      payload: {
        id: Date.now(),
        type: requestType,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        ...form,
      }
    })
    setShowModal(false)
  }

  function cycleStatus(id, currentStatus) {
    dispatch({
      type: 'UPDATE_REQUEST_STATUS',
      payload: { id, status: STATUS_CYCLE[currentStatus] || 'Pending' }
    })
  }

  const filtered = filter === 'All'
    ? state.requests
    : state.requests.filter(r => r.status === filter)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Requests</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your HR requests</p>
        </div>
        <button onClick={openModal} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: state.requests.length, color: 'blue' },
          { label: 'Pending', value: state.requests.filter(r => r.status === 'Pending').length, color: 'amber' },
          { label: 'Approved', value: state.requests.filter(r => r.status === 'Approved').length, color: 'emerald' },
          { label: 'Rejected', value: state.requests.filter(r => r.status === 'Rejected').length, color: 'red' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold text-${color}-400`}>{value}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No requests found.</p>
            <button onClick={openModal} className="btn-primary mt-4 text-sm">Create your first request</button>
          </div>
        ) : (
          filtered.map(req => (
            <div key={req.id} className="glass-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{TYPE_ICONS[req.type] || '📋'}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold">{req.type}</span>
                      {req.leaveType && <span className="text-slate-400 text-sm">· {req.leaveType}</span>}
                      {req.claimType && <span className="text-slate-400 text-sm">· {req.claimType}</span>}
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      Submitted: {new Date(req.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {(req.startDate || req.date) && (
                      <div className="text-slate-400 text-xs">
                        {req.date ? `Date: ${req.date}` : `${req.startDate}${req.endDate ? ` → ${req.endDate}` : ''}`}
                        {req.days ? ` (${req.days} days)` : ''}
                      </div>
                    )}
                    {req.reason && (
                      <p className="text-slate-300 text-sm mt-1.5 max-w-lg">{req.reason}</p>
                    )}
                    {req.amount && (
                      <div className="text-emerald-400 text-sm font-semibold mt-1">PKR {Number(req.amount).toLocaleString()}</div>
                    )}
                    {req.destination && (
                      <div className="text-slate-300 text-sm mt-1">{req.destination} — {req.purpose}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => cycleStatus(req.id, req.status)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                      req.status === 'Pending' ? 'badge-pending' :
                      req.status === 'Approved' ? 'badge-approved' : 'badge-rejected'
                    }`}
                    title="Click to cycle status (demo)"
                  >
                    {req.status}
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_REQUEST', payload: req.id })}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Request</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Request type */}
              <div>
                <label className="label-text">Request Type</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {REQUEST_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setRequestType(t); setForm({}) }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                        requestType === t
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {TYPE_ICONS[t]} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic fields */}
              {requestType === 'Leave' && <LeaveFields form={form} setForm={setForm} />}
              {requestType === 'Remote Work Request' && <RemoteWorkFields form={form} setForm={setForm} />}
              {requestType === 'Missing Punch' && <MissingPunchFields form={form} setForm={setForm} />}
              {requestType === 'Financial Claim' && <FinancialClaimFields form={form} setForm={setForm} />}
              {requestType === 'Business Trip' && <BusinessTripFields form={form} setForm={setForm} />}

              <div className="flex gap-3 pt-2">
                <button onClick={submitRequest} className="btn-primary flex-1">Submit Request</button>
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
