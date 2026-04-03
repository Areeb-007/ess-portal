import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

function formatDateShort(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-PK', {
    weekday: 'short', month: 'short', day: 'numeric'
  })
}

function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getCurrentTime12h() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const [now, setNow] = useState(new Date())
  const [showMissingPunchModal, setShowMissingPunchModal] = useState(false)
  const [missingPunchDate, setMissingPunchDate] = useState('')
  const [missingPunchReason, setMissingPunchReason] = useState('')
  const [newPost, setNewPost] = useState({ content: '', type: 'Photo' })
  const [newTask, setNewTask] = useState('')
  const [showPostForm, setShowPostForm] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const today = toDateStr(now)

  // Get last 3 days including today
  const days = [0, 1, 2].map(i => {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    return toDateStr(d)
  })

  const todayRecord = state.attendance.find(a => a.date === today)

  function handleCheckIn() {
    dispatch({ type: 'CHECK_IN', payload: { date: today, time: getCurrentTime12h() } })
  }

  function handleCheckOut() {
    dispatch({ type: 'CHECK_OUT', payload: { date: today, time: getCurrentTime12h() } })
  }

  function openMissingPunch(date) {
    setMissingPunchDate(date)
    setMissingPunchReason('')
    setShowMissingPunchModal(true)
  }

  function submitMissingPunch() {
    if (!missingPunchReason.trim()) return
    dispatch({
      type: 'ADD_REQUEST',
      payload: {
        id: Date.now(),
        type: 'Missing Punch',
        date: missingPunchDate,
        reason: missingPunchReason,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }
    })
    dispatch({ type: 'MARK_MISSING_PUNCH', payload: missingPunchDate })
    setShowMissingPunchModal(false)
  }

  function toggleTask(id) {
    dispatch({ type: 'TOGGLE_TASK', payload: id })
  }

  function deleteTask(id) {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }

  function addTask() {
    if (!newTask.trim()) return
    dispatch({
      type: 'ADD_TASK',
      payload: { id: Date.now(), title: newTask.trim(), confirmed: false }
    })
    setNewTask('')
  }

  function submitPost() {
    if (!newPost.content.trim()) return
    dispatch({
      type: 'ADD_POST',
      payload: {
        id: Date.now(),
        content: newPost.content.trim(),
        type: newPost.type,
        author: state.profile.name,
        createdAt: new Date().toISOString(),
      }
    })
    setNewPost({ content: '', type: 'Photo' })
    setShowPostForm(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{getGreeting()}, {state.profile.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{formatDate(today)} &bull; {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {!todayRecord?.checkIn ? (
            <button onClick={handleCheckIn} className="btn-success flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Check In
            </button>
          ) : !todayRecord?.checkOut ? (
            <button onClick={handleCheckOut} className="btn-danger flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Check Out
            </button>
          ) : (
            <span className="badge-approved py-2 px-4">Checked Out</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Punches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <h2 className="section-title flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Today's Punches
            </h2>

            <div className="space-y-3">
              {days.map((date, idx) => {
                const record = state.attendance.find(a => a.date === date)
                const isToday = idx === 0
                return (
                  <div key={date} className={`rounded-xl p-4 border ${isToday ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isToday ? 'text-blue-300' : 'text-slate-300'}`}>
                            {isToday ? 'Today' : formatDateShort(date)}
                          </span>
                          {!isToday && (
                            <span className="text-slate-500 text-xs">{date}</span>
                          )}
                        </div>
                        <div className="flex gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-slate-500 text-xs">Check In</span>
                            <div className={record?.checkIn ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                              {record?.checkIn || '—'}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs">Check Out</span>
                            <div className={record?.checkOut ? 'text-orange-400 font-semibold' : 'text-slate-500'}>
                              {record?.checkOut || '—'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        {!record?.checkOut && !record?.missingPunchRequested && (
                          <button
                            onClick={() => openMissingPunch(date)}
                            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Missing Punch
                          </button>
                        )}
                        {record?.missingPunchRequested && (
                          <span className="text-xs badge-pending">Punch Requested</span>
                        )}
                        {record?.checkOut && (
                          <span className="text-xs badge-approved">Complete</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Create Post */}
          <div className="glass-card p-6">
            <h2 className="section-title flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Create Post
            </h2>

            {!showPostForm ? (
              <button
                onClick={() => setShowPostForm(true)}
                className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 text-sm transition-all"
              >
                What's on your mind?
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={newPost.content}
                  onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                  placeholder="Share an update with your team..."
                  rows={3}
                  className="input-field resize-none"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="label-text">Type</label>
                    <select
                      value={newPost.type}
                      onChange={e => setNewPost(p => ({ ...p, type: e.target.value }))}
                      className="input-field py-2"
                    >
                      <option value="Photo">Photo</option>
                      <option value="Video">Video</option>
                      <option value="Document">Document</option>
                      <option value="Text">Text</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={submitPost} className="btn-primary">Post</button>
                    <button onClick={() => setShowPostForm(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent posts */}
            {state.posts.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-slate-400 text-sm font-medium">Recent Posts</div>
                {state.posts.slice(0, 3).map(post => (
                  <div key={post.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">{post.type}</span>
                        <p className="text-slate-300 text-sm mt-1">{post.content}</p>
                        <p className="text-slate-500 text-xs mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                      <button onClick={() => dispatch({ type: 'DELETE_POST', payload: post.id })} className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="glass-card p-6 flex flex-col">
          <h2 className="section-title flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Tasks for 939
          </h2>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-80">
            {state.tasks.map(task => (
              <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${task.confirmed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all mt-0.5 ${task.confirmed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-blue-400'}`}
                >
                  {task.confirmed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 text-xs leading-relaxed ${task.confirmed ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
                  {task.title}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-red-400 flex-shrink-0 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Progress</span>
              <span>{state.tasks.filter(t => t.confirmed).length}/{state.tasks.length} confirmed</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: state.tasks.length ? `${(state.tasks.filter(t => t.confirmed).length / state.tasks.length) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Add task */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Assign new task..."
              className="input-field text-sm py-2 flex-1"
            />
            <button onClick={addTask} className="btn-primary px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Missing Punch Modal */}
      {showMissingPunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMissingPunchModal(false)} />
          <div className="relative glass-card w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Missing Punch Request</h3>
            <div className="space-y-4">
              <div>
                <label className="label-text">Date</label>
                <input type="date" value={missingPunchDate} onChange={e => setMissingPunchDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label-text">Reason</label>
                <textarea
                  value={missingPunchReason}
                  onChange={e => setMissingPunchReason(e.target.value)}
                  placeholder="Please explain why the punch is missing..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={submitMissingPunch} className="btn-primary flex-1">Submit Request</button>
                <button onClick={() => setShowMissingPunchModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
