import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext.jsx'

const SALARY_ROWS = [
  { label: 'Basic', amount: 115000, provident: 'PF', providentStatus: 'Not Enrolled' },
  { label: 'House Rent Allowance', amount: 38500, provident: '', providentStatus: '' },
  { label: 'Utility Allowance', amount: 7300, provident: '', providentStatus: '' },
  { label: 'Conveyance Allowance', amount: 7200, provident: '', providentStatus: '' },
  { label: 'Mobile Allowance', amount: 3000, provident: '', providentStatus: '' },
  { label: 'Internet Allowance', amount: 4000, provident: '', providentStatus: '' },
]

function VerificationModal({ onVerified, onClose }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleVerify() {
    if (!code.trim()) {
      setError('Please enter the verification code.')
      return
    }
    if (code !== '123456') {
      setError('Invalid verification code. Please try again.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onVerified()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-bold text-lg">Enter Verification Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 mb-5 space-y-3">
          <div>
            <p className="font-semibold text-gray-700 mb-1">
              Case 1 — First-Time Setup (If you have not requested a QR Code before)
            </p>
            <ul className="space-y-1 list-disc list-inside text-gray-500 text-xs">
              <li>Click "Request QR Code".</li>
              <li>Check your official email and open the QR code.</li>
              <li>Scan the QR code using Google Authenticator.</li>
              <li>Copy the 6-digit code from the app and paste it into the Verification Code field below.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">
              Case 2 — Verification for Existing Setup (If you already scanned the QR Code before)
            </p>
            <ul className="space-y-1 list-disc list-inside text-gray-500 text-xs">
              <li>Open Google Authenticator.</li>
              <li>Copy the 6-digit code.</li>
              <li>Enter it in the Verification Code field below.</li>
            </ul>
          </div>
        </div>

        {/* Request QR Code */}
        <div className="flex items-center justify-between mb-5 bg-gray-50 rounded-xl px-4 py-3">
          <span className="text-gray-500 text-sm">Haven't set up Google Authenticator yet?</span>
          <button className="flex items-center gap-1.5 bg-tmc-500 hover:bg-tmc-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM6.5 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM19.5 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Request QR Code
          </button>
        </div>

        {/* Code input */}
        <div className="mb-4">
          <label className="label-text">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="Please enter the 6-digit verification code"
            maxLength={6}
            className="input-field tracking-widest text-center text-lg font-mono"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <p className="text-gray-400 text-xs mt-1">Demo code: 123456</p>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-tmc-500 hover:bg-tmc-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>Verify <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Compensation() {
  const { state, dispatch } = useApp()
  const [verified, setVerified] = useState(false)
  const [showVerification, setShowVerification] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Performance Bonus', amount: '', date: '', notes: '', currency: 'PKR' })
  const [slipForm, setSlipForm] = useState({ month: '', year: new Date().getFullYear().toString(), notes: '' })
  const [slipFileData, setSlipFileData] = useState(null)
  const [showSlipForm, setShowSlipForm] = useState(false)
  const [previewSlip, setPreviewSlip] = useState(null)
  const [slipFileError, setSlipFileError] = useState('')
  const slipFileRef = useRef(null)

  function handleSlipFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setSlipFileError('File is too large (max 3 MB). Please compress or use a smaller file.')
      e.target.value = ''
      return
    }
    setSlipFileError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      setSlipFileData({ base64: ev.target.result, type: file.type, name: file.name, size: file.size })
    }
    reader.readAsDataURL(file)
  }

  function handleSlipSubmit() {
    if (!slipForm.month || !slipForm.year) return
    dispatch({
      type: 'ADD_SALARY_SLIP',
      payload: {
        id: Date.now(),
        month: slipForm.month,
        year: slipForm.year,
        notes: slipForm.notes,
        uploadedAt: new Date().toISOString().split('T')[0],
        fileBase64: slipFileData?.base64 || null,
        fileType: slipFileData?.type || null,
        fileName: slipFileData?.name || null,
      }
    })
    setSlipForm({ month: '', year: new Date().getFullYear().toString(), notes: '' })
    setSlipFileData(null)
    setShowSlipForm(false)
  }

  function handleSubmit() {
    if (!form.amount || !form.date) return
    dispatch({ type: 'ADD_COMPENSATION', payload: { ...form, id: Date.now() } })
    setForm({ type: 'Performance Bonus', amount: '', date: '', notes: '', currency: 'PKR' })
    setShowForm(false)
  }

  const total = state.compensations.reduce((sum, c) => sum + Number(c.amount || 0), 0)

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Verification Modal */}
      {showVerification && !verified && (
        <VerificationModal
          onVerified={() => { setVerified(true); setShowVerification(false) }}
          onClose={() => setShowVerification(false)}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gray-700 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">Compensation</h1>
          <p className="text-gray-400 text-sm">Comprehensive compensation and benefits overview.</p>
        </div>
        {!showVerification && !verified && (
          <button
            onClick={() => setShowVerification(true)}
            className="ml-auto bg-tmc-500 hover:bg-tmc-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Verify Access
          </button>
        )}
      </div>

      {/* Content — blurred if not verified */}
      <div className={`space-y-4 ${!verified ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Salary Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 font-semibold">Salary Overview</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
              {showForm ? 'Cancel' : '+ Add Record'}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                    {['Salary Adjustment','Performance Bonus','Annual Increment','Allowance','Overtime Pay','Commission','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Amount (PKR)</label>
                  <input type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" className="input-field" />
                </div>
                <div>
                  <label className="label-text">Effective Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="label-text">Notes</label>
                  <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSubmit} className="btn-primary">Add Record</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-500 text-xs mb-1">Total Monthly Compensation</div>
              <div className="text-gray-800 font-bold text-lg">PKR 175,000</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-500 text-xs mb-1">Total Records</div>
              <div className="text-gray-800 font-bold text-lg">{state.compensations.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-500 text-xs mb-1">2026 Total</div>
              <div className="text-gray-800 font-bold text-lg">PKR {state.compensations.filter(c => c.date?.startsWith('2026')).reduce((s, c) => s + Number(c.amount || 0), 0).toLocaleString() || '0'}</div>
            </div>
          </div>

          {/* Salary breakdown table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4"></th>
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4">Amount</th>
                  <th className="text-left text-gray-500 font-medium pb-3 pr-4">Provident Fund</th>
                  <th className="text-left text-gray-500 font-medium pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {SALARY_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 text-gray-700 font-medium">{row.label}</td>
                    <td className="py-3 pr-4 text-gray-500">{row.amount ? `PKR ${row.amount.toLocaleString()}` : '—'}</td>
                    <td className="py-3 pr-4 text-gray-500">{row.provident}</td>
                    <td className="py-3">
                      {row.providentStatus && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{row.providentStatus}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Slips */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-gray-800 font-semibold">Salary Slips</h2>
            </div>
            <button onClick={() => setShowSlipForm(!showSlipForm)} className="btn-primary text-sm">
              {showSlipForm ? 'Cancel' : '+ Upload Slip'}
            </button>
          </div>

          {showSlipForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Month</label>
                  <select value={slipForm.month} onChange={e => setSlipForm(f => ({ ...f, month: e.target.value }))} className="input-field">
                    <option value="">Select month</option>
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">Year</label>
                  <select value={slipForm.year} onChange={e => setSlipForm(f => ({ ...f, year: e.target.value }))} className="input-field">
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Notes (optional)</label>
                  <input type="text" value={slipForm.notes} onChange={e => setSlipForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. includes bonus" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Attach File (PDF or Image)</label>
                  <div
                    onClick={() => slipFileRef.current?.click()}
                    className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-tmc-400 hover:bg-tmc-50 transition-colors"
                  >
                    {slipFileData ? (
                      <>
                        <svg className="w-8 h-8 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm font-medium text-tmc-700">{slipFileData.name}</p>
                        <p className="text-xs text-gray-400">{(slipFileData.size / 1024).toFixed(1)} KB — click to change</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload salary slip</p>
                        <p className="text-xs text-gray-400">PDF, PNG, JPG supported</p>
                      </>
                    )}
                  </div>
                  <input ref={slipFileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleSlipFileChange} />
                  {slipFileError && <p className="text-red-500 text-xs mt-1">{slipFileError}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSlipSubmit} disabled={!slipForm.month || !slipForm.year} className="btn-primary disabled:opacity-50">Upload Slip</button>
                <button onClick={() => { setShowSlipForm(false); setSlipFileData(null); setSlipFileError('') }} className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}

          {state.salarySlips.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No salary slips uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.salarySlips.map(slip => (
                <div key={slip.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-800 font-semibold text-sm">{slip.month} {slip.year}</p>
                      {slip.notes && <p className="text-gray-500 text-xs mt-0.5">{slip.notes}</p>}
                      <p className="text-gray-400 text-xs mt-1">Uploaded {slip.uploadedAt}</p>
                    </div>
                    <div className="w-9 h-9 bg-tmc-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {slip.fileBase64 && (
                      <button onClick={() => setPreviewSlip(slip)} className="flex-1 text-xs bg-white border border-gray-200 hover:border-tmc-400 text-gray-600 hover:text-tmc-600 font-medium py-1.5 rounded-lg transition-colors">
                        View
                      </button>
                    )}
                    {slip.fileBase64 && (
                      <a href={slip.fileBase64} download={slip.fileName || `${slip.month}-${slip.year}-slip`} className="flex-1 text-center text-xs bg-white border border-gray-200 hover:border-tmc-400 text-gray-600 hover:text-tmc-600 font-medium py-1.5 rounded-lg transition-colors">
                        Download
                      </a>
                    )}
                    <button onClick={() => dispatch({ type: 'DELETE_SALARY_SLIP', payload: slip.id })} className="text-xs bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 font-medium px-3 py-1.5 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slip Preview Modal */}
        {previewSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewSlip(null)} />
            <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h3 className="text-gray-800 font-semibold">{previewSlip.month} {previewSlip.year} — Salary Slip</h3>
                  {previewSlip.fileName && <p className="text-gray-500 text-xs">{previewSlip.fileName}</p>}
                </div>
                <button onClick={() => setPreviewSlip(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {previewSlip.fileType?.startsWith('image/') ? (
                  <img src={previewSlip.fileBase64} alt="Salary slip" className="max-w-full mx-auto rounded-xl" />
                ) : previewSlip.fileType === 'application/pdf' ? (
                  <iframe src={previewSlip.fileBase64} title="Salary slip" className="w-full h-[60vh] rounded-xl" />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm mb-4">Preview not available.</p>
                    <a href={previewSlip.fileBase64} download={previewSlip.fileName} className="btn-primary inline-block">Download File</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compensation Records */}
        {state.compensations.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-gray-800 font-semibold mb-4">Compensation Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Date', 'Type', 'Amount (PKR)', 'Notes', ''].map(h => (
                      <th key={h} className="text-left text-gray-500 font-medium pb-3 pr-4 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...state.compensations].sort((a, b) => b.date.localeCompare(a.date)).map(c => (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-4 text-gray-700 font-medium whitespace-nowrap">
                        {new Date(c.date + 'T00:00:00').toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="bg-tmc-50 text-tmc-700 border border-tmc-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">{c.type}</span>
                      </td>
                      <td className="py-3 pr-4 text-tmc-600 font-semibold">{Number(c.amount).toLocaleString()}</td>
                      <td className="py-3 pr-4 text-gray-500 max-w-xs">{c.notes || '—'}</td>
                      <td className="py-3">
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

      {/* Not verified overlay message */}
      {!verified && !showVerification && (
        <div className="text-center py-4">
          <button
            onClick={() => setShowVerification(true)}
            className="text-tmc-600 text-sm font-medium hover:underline"
          >
            Click to verify your identity to view compensation details
          </button>
        </div>
      )}
    </div>
  )
}
