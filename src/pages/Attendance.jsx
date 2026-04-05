import React, { useState, useMemo } from 'react'
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
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
]

export default function Attendance() {
  const { state, dispatch } = useApp()
  const [selectedMonth, setSelectedMonth] = useState('2026-04')

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
      : 'bg-orange-50 text-orange-700 border border-orange-200'
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
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

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-gray-700 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">My Previous Attendance</h1>
          <p className="text-gray-400 text-sm">Review your past attendance records</p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-semibold">Insights</h2>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-tmc-400"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">Total Time Spent</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-800 font-bold text-sm">{minutesToHM(insights.totalMins)}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">Average Check-In Time</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
              </svg>
              <span className="text-gray-800 font-bold text-sm">{formatMinutesToTime(insights.avgCi)}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">Average Check-Out Time</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              <span className="text-gray-800 font-bold text-sm">{formatMinutesToTime(insights.avgCo)}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">Average Duration</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-800 font-bold text-sm">{minutesToHM(insights.avgDur)}</span>
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-2">Total Absences</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-red-500 font-bold text-sm">{insights.absences}</span>
            </div>
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
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-tmc-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                    Check In
                  </th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
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
                      <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                        {new Date(record.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{record.checkIn || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{record.checkOut || 'Not recorded'}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{calcDuration(record)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        {locationBadge(record.checkInLocation, 'green')}
                      </td>
                      <td className="px-4 py-3">
                        {locationBadge(record.checkOutLocation, 'orange')}
                      </td>
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
