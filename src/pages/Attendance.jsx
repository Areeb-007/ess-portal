import React, { useState, useMemo, useRef } from 'react'
import { useApp } from '../context/AppContext.jsx'

function parseTime(timeStr) {
  if (!timeStr) return null
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function minutesToHM(mins) {
  if (mins == null || mins < 0) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

function formatMinutesToTime(mins) {
  if (mins == null) return '—'
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
}

const MONTHS = [
  { value: '2026-05', label: 'May 2026' },
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
]

function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''))
  return lines.slice(1).map((line, i) => {
    const cols = line.split(',').map(c => c.trim())
    const row = {}
    headers.forEach((h, idx) => { row[h] = cols[idx] || '' })
    return {
      id: Date.now() + i,
      date: row['date'] || '',
      checkIn: row['checkin'] || null,
      checkOut: row['checkout'] || null,
      status: row['status'] || 'Present',
      missingPunchRequested: false,
      checkInLocation: row['checkinlocation'] || null,
      checkOutLocation: row['checkoutlocation'] || null,
    }
  }).filter(r => r.date)
}

export default function Attendance() {
  const { state, dispatch } = useApp()
  const [selectedMonth, setSelectedMonth] = useState('2026-05')
  const [importMsg, setImportMsg] = useState('')
  const fileRef = useRef(null)

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const records = parseCSV(ev.target.result)
      if (records.length === 0) {
        setImportMsg('No valid records found. Check the CSV format.')
        return
      }
      dispatch({ type: 'IMPORT_ATTENDANCE', payload: records })
      setImportMsg(`${records.length} record(s) imported successfully.`)
      setTimeout(() => setImportMsg(''), 4000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const filtered = useMemo(() => {
    return [...state.attendance]
      .filter(a => a.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [state.attendance, selectedMonth])

  // Insights
  const insights = useMemo(() => {
    const present = filtered.filter(a => a.checkIn && a.checkOut)
    const absences = filtered.filter(a => a.status === 'Absent').length

    const durations = present.map(a => {
      const ci = parseTime(a.checkIn)
      const co = parseTime(a.checkOut)
      return co != null && ci != null ? co - ci : null
    }).filter(d => d != null && d > 0)

    const checkIns = present.map(a => parseTime(a.checkIn)).filter(t => t != null)
    const checkOuts = present.map(a => parseTime(a.checkOut)).filter(t => t != null)

    const totalMins = durations.reduce((s, d) => s + d, 0)
    const avgCi = checkIns.length ? Math.round(checkIns.reduce((s, t) => s + t, 0) / checkIns.length) : null
    const avgCo = checkOuts.length ? Math.round(checkOuts.reduce((s, t) => s + t, 0) / checkOuts.length) : null
    const avgDur = durations.length ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length) : null

    return { totalMins, avgCi, avgCo, avgDur, absences }
  }, [filtered])

  function statusBadge(record) {
    if (!record.checkOut && record.checkIn) return { label: 'Missing Punch', cls: 'bg-amber-50 text-amber-700 border border-amber-200' }
    if (record.status === 'Present') return { label: 'Present', cls: 'bg-tmc-50 text-tmc-700 border border-tmc-200' }
    if (record.status === 'Absent') return { label: 'Absent', cls: 'bg-red-50 text-red-600 border border-red-200' }
    return { label: record.status || 'Present', cls: 'bg-gray-100 text-gray-600' }
  }

  function locationBadge(location, color) {
    if (!location) return <span className="text-gray-400 text-xs">N/A</span>
    const cls = color === 'green'
      ? 'bg-tmc-50 text-tmc-700 border border-tmc-200'
      : 'bg-orange-50 text-orange-600 border border-orange-200'
    const iconColor = color === 'green' ? 'text-tmc-500' : 'text-orange-400'
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
        <svg className={`w-3 h-3 ${iconColor}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        {location}
      </span>
    )
  }

  function calcDuration(record) {
    const ci = parseTime(record.checkIn)
    const co = parseTime(record.checkOut)
    if (ci == null || co == null) return '—'
    const diff = co - ci
    if (diff <= 0) return '—'
    return `${Math.floor(diff / 60)} hours ${diff % 60} minutes`
  }

  const selectedLabel = MONTHS.find(m => m.value === selectedMonth)?.label || ''

  return (
    <div className="max-w-6xl mx-auto space-y-4">

      {/* Insights */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800 font-bold text-lg">Insights</h2>
          <div className="flex items-center gap-3">
            {importMsg && <span className="text-tmc-600 text-xs font-medium">{importMsg}</span>}
            <label className="flex items-center gap-1.5 bg-tmc-500 hover:bg-tmc-600 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload CSV
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} className="hidden" />
            </label>
            <div className="relative">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg pl-4 pr-8 py-1.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-tmc-400 bg-white cursor-pointer"
            >
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Total Time Spent */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <svg className="w-4 h-4 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Time Spent
            </div>
            <div className="text-gray-800 font-extrabold text-xl leading-tight">{minutesToHM(insights.totalMins)}</div>
          </div>

          {/* Avg Check-In */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <svg className="w-4 h-4 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
              </svg>
              Average Check-In Time
            </div>
            <div className="text-gray-800 font-extrabold text-xl leading-tight">{formatMinutesToTime(insights.avgCi)}</div>
          </div>

          {/* Avg Check-Out */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Average Check-Out Time
            </div>
            <div className="text-gray-800 font-extrabold text-xl leading-tight">{formatMinutesToTime(insights.avgCo)}</div>
          </div>

          {/* Avg Duration */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <svg className="w-4 h-4 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Average Duration
            </div>
            <div className="text-gray-800 font-extrabold text-xl leading-tight">{minutesToHM(insights.avgDur)}</div>
          </div>

          {/* Total Absences */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Total Absences
            </div>
            <div className="text-red-500 font-extrabold text-xl leading-tight">{insights.absences}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
          <p>No attendance records for this month.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Check In</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Check Out</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Duration</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-tmc-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Check In
                    </span>
                  </th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Check Out
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(record => {
                  const badge = statusBadge(record)
                  return (
                    <tr key={record.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-700 font-medium whitespace-nowrap">
                        {new Date(record.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{record.checkIn || '—'}</td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{record.checkOut || 'Not recorded'}</td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{calcDuration(record)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3.5">{locationBadge(record.checkInLocation, 'green')}</td>
                      <td className="px-4 py-3.5">{locationBadge(record.checkOutLocation, 'orange')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
