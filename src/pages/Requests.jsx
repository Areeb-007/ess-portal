import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'

const CLAIM_CATEGORIES = [
  'Medical Benefit (OPD)',
  'Business Expense on behalf of TMC',
  'Advance TADA for Local Travel',
  'Advance TADA for International Travel',
  'Travel Reimbursement',
  'Other',
]

const PUNCH_TYPES = ['Check In', 'Check Out']

function CustomDropdown({ options, value, onChange, placeholder, error, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border bg-white text-sm transition-all duration-200
          ${error ? 'border-red-400' : open ? 'border-tmc-400 ring-2 ring-tmc-100' : 'border-gray-300'}
          ${value ? 'text-gray-800' : 'text-gray-400'}
          ${disabled ? 'bg-gray-50 cursor-default' : 'cursor-pointer'}`}
      >
        <span>{value || placeholder}</span>
        {!disabled && (
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto max-h-64">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-5 py-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0
                ${value === opt ? 'bg-tmc-50 text-tmc-700 font-medium' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const REQUEST_TYPES = ['Leave', 'Remote Work Request', 'Missing Punch', 'Financial Claim', 'Business Trip']

const REQUEST_CARDS = [
  {
    type: 'Leave',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: 'Remote Work Request',
    label: 'Remote Work Request',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: 'Missing Punch',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: 'Financial Claim',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: 'Business Trip',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
]

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-red-500 text-xs mt-1">{msg}</p>
}

function fieldClass(error) {
  return `input-field${error ? ' border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`
}

function LeaveFields({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Leave Type <span className="text-red-500">*</span></label>
          <select value={form.leaveType || ''} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className={fieldClass(errors.leaveType)}>
            <option value="">Select type</option>
            <option>Annual Leave</option><option>Sick Leave</option><option>Casual Leave</option>
            <option>Maternity Leave</option><option>Paternity Leave</option><option>Unpaid Leave</option>
          </select>
          <FieldError msg={errors.leaveType} />
        </div>
        <div>
          <label className="label-text">Start Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.startDate || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={fieldClass(errors.startDate)} />
          <FieldError msg={errors.startDate} />
        </div>
        <div>
          <label className="label-text">End Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={fieldClass(errors.endDate)} />
          <FieldError msg={errors.endDate} />
        </div>
        <div>
          <label className="label-text">Number of Days</label>
          <input type="number" min="1" value={form.days || ''} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} placeholder="0" className="input-field" />
        </div>
      </div>
      <div>
        <label className="label-text">Reason <span className="text-red-500">*</span></label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Please state your reason..." className={`${fieldClass(errors.reason)} resize-none`} />
        <FieldError msg={errors.reason} />
      </div>
    </>
  )
}

function RemoteWorkFields({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Start Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.startDate || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={fieldClass(errors.startDate)} />
          <FieldError msg={errors.startDate} />
        </div>
        <div>
          <label className="label-text">End Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={fieldClass(errors.endDate)} />
          <FieldError msg={errors.endDate} />
        </div>
      </div>
      <div>
        <label className="label-text">Reason / Justification <span className="text-red-500">*</span></label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Why are you requesting remote work?" className={`${fieldClass(errors.reason)} resize-none`} />
        <FieldError msg={errors.reason} />
      </div>
    </>
  )
}

function MissingPunchFields({ form, setForm, errors }) {
  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setForm(f => ({ ...f, attachedFileName: '', attachedFileError: 'File must be under 5MB' }))
      return
    }
    setForm(f => ({ ...f, attachedFileName: file.name, attachedFileError: '' }))
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Function <span className="text-red-500">*</span></label>
          <CustomDropdown
            options={['Attendance']}
            value="Attendance"
            onChange={() => {}}
            placeholder="Attendance"
            disabled
          />
        </div>
        <div>
          <label className="label-text">Punch Type <span className="text-red-500">*</span></label>
          <CustomDropdown
            options={PUNCH_TYPES}
            value={form.punchType || ''}
            onChange={val => setForm(f => ({ ...f, punchType: val }))}
            placeholder="Select"
            error={errors.punchType}
          />
          <FieldError msg={errors.punchType} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.date || ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={fieldClass(errors.date)} />
          <FieldError msg={errors.date} />
        </div>
        <div>
          <label className="label-text">Punch Time <span className="text-red-500">*</span></label>
          <input type="time" value={form.punchTime || ''} onChange={e => setForm(f => ({ ...f, punchTime: e.target.value }))} className={fieldClass(errors.punchTime)} />
          <FieldError msg={errors.punchTime} />
        </div>
      </div>

      <div>
        <label className="label-text">Reason <span className="text-red-500">*</span></label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={4} placeholder="Enter the reason for missing punch..." className={`${fieldClass(errors.reason)} resize-none`} />
        <FieldError msg={errors.reason} />
      </div>

      <div>
        <label className="label-text">Attached File <span className="text-gray-400 font-normal">(Optional)</span></label>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm text-gray-400 truncate">
            {form.attachedFileName || 'no file selected'}
          </div>
          <label className="flex items-center gap-1.5 bg-tmc-500 hover:bg-tmc-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            ADD FILE
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        <p className="text-gray-400 text-xs mt-1">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB)</p>
        {form.attachedFileError && <p className="text-red-500 text-xs mt-1">{form.attachedFileError}</p>}
      </div>
    </>
  )
}

const CLAIM_LIMITS = {
  'Medical Benefit (OPD)':                  { total: 60501,  remaining: 57773 },
  'Business Expense on behalf of TMC':       { total: 50000,  remaining: 50000 },
  'Advance TADA for Local Travel':           { total: 30000,  remaining: 30000 },
  'Advance TADA for International Travel':   { total: 150000, remaining: 150000 },
  'Travel Reimbursement':                    { total: 25000,  remaining: 25000 },
  'Other':                                   { total: 10000,  remaining: 10000 },
}

function FinancialClaimFields({ form, setForm, errors }) {
  const limits = form.claimType ? CLAIM_LIMITS[form.claimType] : null

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setForm(f => ({ ...f, attachedFileName: '', attachedFileError: 'File must be under 5MB' }))
      return
    }
    setForm(f => ({ ...f, attachedFileName: file.name, attachedFileError: '' }))
  }

  return (
    <>
      <div>
        <label className="label-text">Request Category <span className="text-red-500">*</span></label>
        <CustomDropdown
          options={CLAIM_CATEGORIES}
          value={form.claimType || ''}
          onChange={val => setForm(f => ({ ...f, claimType: val }))}
          placeholder="Select Request Category"
          error={errors.claimType}
        />
        <FieldError msg={errors.claimType} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Transaction Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.expenseDate || ''} onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))} className={fieldClass(errors.expenseDate)} />
          <FieldError msg={errors.expenseDate} />
        </div>
        <div>
          <label className="label-text">Bill Amount (PKR) <span className="text-red-500">*</span></label>
          <input type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="Enter Bill Amount" className={fieldClass(errors.amount)} />
          {limits && (
            <div className="mt-1.5 space-y-0.5">
              <p className="text-xs text-gray-500">Total Limit: PKR {limits.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Remaining Balance: {limits.remaining.toLocaleString()}</p>
            </div>
          )}
          <FieldError msg={errors.amount} />
        </div>
      </div>

      <div>
        <label className="label-text">Reason <span className="text-red-500">*</span></label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={4} placeholder="Enter the reason for financial claim request..." className={`${fieldClass(errors.reason)} resize-none`} />
        <FieldError msg={errors.reason} />
      </div>

      <div>
        <label className="label-text">Attached File <span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <div className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${errors.attachedFileName ? 'border-red-400' : 'border-gray-300'} bg-white text-gray-400 truncate`}>
            {form.attachedFileName || 'no file selected'}
          </div>
          <label className="flex items-center gap-1.5 bg-tmc-500 hover:bg-tmc-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            ADD FILE
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        <p className="text-gray-400 text-xs mt-1">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB)</p>
        {form.attachedFileError && <p className="text-red-500 text-xs mt-1">{form.attachedFileError}</p>}
        <FieldError msg={errors.attachedFileName} />
      </div>
    </>
  )
}

function BusinessTripFields({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Destination <span className="text-red-500">*</span></label>
          <input type="text" value={form.destination || ''} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="City / Country" className={fieldClass(errors.destination)} />
          <FieldError msg={errors.destination} />
        </div>
        <div>
          <label className="label-text">Purpose <span className="text-red-500">*</span></label>
          <input type="text" value={form.purpose || ''} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="Meeting, Conference, Training..." className={fieldClass(errors.purpose)} />
          <FieldError msg={errors.purpose} />
        </div>
        <div>
          <label className="label-text">Departure Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.startDate || ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={fieldClass(errors.startDate)} />
          <FieldError msg={errors.startDate} />
        </div>
        <div>
          <label className="label-text">Return Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.endDate || ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={fieldClass(errors.endDate)} />
          <FieldError msg={errors.endDate} />
        </div>
      </div>
      <div>
        <label className="label-text">Additional Notes</label>
        <textarea value={form.reason || ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Any additional information..." className="input-field resize-none" />
      </div>
    </>
  )
}

function validate(requestType, form) {
  const e = {}
  const req = (field, label) => { if (!form[field]?.toString().trim()) e[field] = `${label} is required` }

  if (requestType === 'Leave') {
    req('leaveType', 'Leave type')
    req('startDate', 'Start date')
    req('endDate', 'End date')
    req('reason', 'Reason')
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date'
  } else if (requestType === 'Remote Work Request') {
    req('startDate', 'Start date')
    req('endDate', 'End date')
    req('reason', 'Reason')
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date'
  } else if (requestType === 'Missing Punch') {
    req('punchType', 'Punch type')
    req('date', 'Date')
    req('punchTime', 'Punch time')
    req('reason', 'Reason')
  } else if (requestType === 'Financial Claim') {
    req('claimType', 'Request category')
    req('expenseDate', 'Transaction date')
    req('amount', 'Bill amount')
    req('reason', 'Reason')
    req('attachedFileName', 'Attached file')
    if (form.amount && Number(form.amount) <= 0) e.amount = 'Amount must be greater than 0'
  } else if (requestType === 'Business Trip') {
    req('destination', 'Destination')
    req('purpose', 'Purpose')
    req('startDate', 'Departure date')
    req('endDate', 'Return date')
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'Return date must be after departure date'
  }
  return e
}

export default function Requests() {
  const { state, dispatch } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [requestType, setRequestType] = useState('Leave')
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  function openModal(type) {
    setForm({})
    setErrors({})
    setRequestType(type || 'Leave')
    setShowModal(true)
  }

  function submitRequest() {
    const errs = validate(requestType, form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
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

  const filtered = state.requests.filter(r => {
    if (!searchQuery) return true
    return r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (r.claimType || '').toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-gray-700 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">My Request</h1>
          <p className="text-gray-400 text-sm">Request management system to handle various employee requests efficiently.</p>
        </div>
      </div>

      {/* Create New Requests */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-gray-800 font-semibold mb-4">Create New Requests</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {REQUEST_CARDS.map(card => (
            <button
              key={card.type}
              onClick={() => openModal(card.type)}
              className="relative flex flex-col items-center justify-center gap-3 py-7 px-4 border border-gray-200 rounded-xl hover:border-tmc-400 hover:bg-tmc-50 hover:-translate-y-2 hover:shadow-lg transition-all duration-200 group"
            >
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-tmc-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow">+</span>
              <span className="text-gray-400 group-hover:text-tmc-500 transition-colors">
                {card.icon}
              </span>
              <span className="text-gray-600 text-xs font-medium text-center group-hover:text-tmc-700 leading-tight">
                {card.label || card.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-semibold">Requests</h2>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-tmc-400 focus:ring-2 focus:ring-tmc-100"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4 text-xs uppercase tracking-wider">Request Type</th>
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4 text-xs uppercase tracking-wider">Submission Date</th>
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left text-gray-500 font-medium pb-3 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <tr key={req.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-tmc-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium">
                            {req.claimType ? `${req.claimType}` : req.type}
                          </div>
                          {req.reason && (
                            <div className="text-gray-400 text-xs">{req.reason}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        req.status === 'Approved' ? 'bg-tmc-50 text-tmc-700 border border-tmc-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => dispatch({ type: 'DELETE_REQUEST', payload: req.id })}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl font-bold">
                {requestType === 'Financial Claim' ? 'Financial Claim Request'
                  : requestType === 'Missing Punch' ? 'Missing Punch Request'
                  : 'Create Request'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="label-text">Request Type</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {REQUEST_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setRequestType(t); setForm({}); setErrors({}) }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                        requestType === t
                          ? 'bg-tmc-500 border-tmc-500 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-tmc-600 hover:border-tmc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {requestType === 'Leave' && <LeaveFields form={form} setForm={setForm} errors={errors} />}
              {requestType === 'Remote Work Request' && <RemoteWorkFields form={form} setForm={setForm} errors={errors} />}
              {requestType === 'Missing Punch' && <MissingPunchFields form={form} setForm={setForm} errors={errors} />}
              {requestType === 'Financial Claim' && <FinancialClaimFields form={form} setForm={setForm} errors={errors} />}
              {requestType === 'Business Trip' && <BusinessTripFields form={form} setForm={setForm} errors={errors} />}

              <div className="flex gap-3 pt-2">
                <button onClick={submitRequest} className="btn-primary flex-1">
                  {requestType === 'Financial Claim' || requestType === 'Missing Punch' ? 'Send Request' : 'Submit Request'}
                </button>
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
