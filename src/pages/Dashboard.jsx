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

function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
  const [newPost, setNewPost] = useState({ content: '', type: 'Post' })
  const [postTab, setPostTab] = useState('Post')
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const today = toDateStr(now)

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

  function addTask() {
    if (!newTask.trim()) return
    dispatch({ type: 'ADD_TASK', payload: { id: Date.now(), title: newTask.trim(), confirmed: false } })
    setNewTask('')
  }

  function submitPost() {
    if (!newPost.content.trim()) return
    dispatch({
      type: 'ADD_POST',
      payload: {
        id: Date.now(),
        content: newPost.content.trim(),
        type: postTab,
        author: state.profile.name,
        createdAt: new Date().toISOString(),
      }
    })
    setNewPost({ content: '', type: 'Post' })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Greeting + Check In/Out */}
          <div className="bg-[#1e2d4a] rounded-2xl p-5 text-white">
            <div className="text-xs text-gray-400 mb-1">
              {formatDate(today)}, {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
            <div className="text-lg font-bold mb-1">
              {getGreeting()} <br />
              <span>{state.profile.name}</span>{' '}
              <span role="img" aria-label="wave">👋</span>
            </div>

            <div className="mt-4">
              {todayRecord?.checkIn && !todayRecord?.checkOut ? (
                <button
                  onClick={handleCheckOut}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
                >
                  Check Out
                </button>
              ) : (
                <button
                  onClick={handleCheckIn}
                  className="bg-tmc-500 hover:bg-tmc-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
                >
                  Check In
                </button>
              )}
            </div>

            <div className="mt-4">
              <button className="text-tmc-400 text-sm font-medium hover:text-tmc-300 transition-colors">
                Today's Punches
              </button>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-gray-700 font-semibold text-sm mb-3">Attendance</h2>
            <div className="space-y-4">
              {days.map((date, idx) => {
                const record = state.attendance.find(a => a.date === date)
                return (
                  <div key={date}>
                    <div className="text-gray-500 text-xs font-medium mb-2">{formatDateLabel(date)}</div>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                          <svg className="w-3 h-3 text-tmc-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                          Check In
                        </div>
                        <div className={`text-sm font-semibold ${record?.checkIn ? 'text-gray-700' : 'text-gray-400'}`}>
                          {record?.checkIn || '—'}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                          <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                          Check Out
                        </div>
                        <div className={`text-sm font-semibold ${record?.checkOut ? 'text-gray-700' : 'text-gray-400'}`}>
                          {record?.checkOut || 'Not recorded'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {!record?.checkOut && !record?.missingPunchRequested && record?.checkIn && (
                        <button
                          onClick={() => openMissingPunch(date)}
                          className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1 rounded-lg transition-all"
                        >
                          Missing Punch
                        </button>
                      )}
                      {record?.missingPunchRequested && (
                        <span className="text-xs badge-pending">Punch Requested</span>
                      )}
                      {record?.checkOut && (
                        <span className="text-xs badge-approved">Present</span>
                      )}
                      {record?.status === 'Absent' && !record?.checkIn && (
                        <span className="text-xs badge-rejected">Absent</span>
                      )}
                      {!record?.checkOut && record?.checkIn && !record?.missingPunchRequested && (
                        <span className="text-xs badge-pending">Missing Punch</span>
                      )}
                    </div>
                    {idx < days.length - 1 && <div className="border-b border-gray-100 mt-3" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle column - Create Post + Posts */}
        <div className="lg:col-span-3 space-y-4">
          {/* Create Post */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-gray-700 font-semibold text-base mb-4">Create Post</h2>
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-100 mb-4">
              {['Post', 'Photo/Video', 'Document'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setPostTab(tab)}
                  className={`flex items-center gap-1.5 text-xs font-medium pb-2 border-b-2 transition-colors ${
                    postTab === tab ? 'border-tmc-500 text-tmc-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'Post' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                  {tab === 'Photo/Video' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {tab === 'Document' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {tab}
                </button>
              ))}
            </div>
            <textarea
              value={newPost.content}
              onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
              placeholder="Write Something ...."
              rows={8}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-tmc-400 focus:ring-2 focus:ring-tmc-100 resize-none text-sm transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-gray-400 text-xs">{newPost.content.length}/2000 characters</span>
              <button
                onClick={submitPost}
                disabled={!newPost.content.trim()}
                className="bg-gray-200 hover:bg-tmc-500 hover:text-white text-gray-500 font-medium px-5 py-1.5 rounded-lg text-sm transition-all disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>

          {/* Birthday card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 overflow-hidden relative">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">🎉</span>
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold text-sm">Happy Birthday Bilal Ahmed!</h3>
                <p className="text-gray-500 text-sm mt-1">Wishing you a great birthday and a memorable year.</p>
              </div>
              <button className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            {/* Confetti decoration */}
            <div className="relative h-16 overflow-hidden">
              {[
                { color: 'bg-yellow-400', x: '8%',  y: '10%', r: '15deg',  w: 'w-3', h: 'h-1.5' },
                { color: 'bg-pink-400',   x: '20%', y: '50%', r: '-20deg', w: 'w-2', h: 'h-2' },
                { color: 'bg-blue-400',   x: '35%', y: '20%', r: '30deg',  w: 'w-4', h: 'h-1' },
                { color: 'bg-green-400',  x: '50%', y: '60%', r: '-10deg', w: 'w-2', h: 'h-3' },
                { color: 'bg-purple-400', x: '65%', y: '15%', r: '25deg',  w: 'w-3', h: 'h-1.5' },
                { color: 'bg-red-400',    x: '75%', y: '55%', r: '-30deg', w: 'w-2', h: 'h-2' },
                { color: 'bg-yellow-300', x: '85%', y: '25%', r: '10deg',  w: 'w-4', h: 'h-1' },
                { color: 'bg-blue-300',   x: '92%', y: '65%', r: '-15deg', w: 'w-2', h: 'h-2.5' },
                { color: 'bg-pink-300',   x: '45%', y: '40%', r: '20deg',  w: 'w-3', h: 'h-1' },
                { color: 'bg-orange-400', x: '58%', y: '75%', r: '-25deg', w: 'w-2', h: 'h-2' },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`absolute ${c.color} ${c.w} ${c.h} rounded-sm opacity-80`}
                  style={{ left: c.x, top: c.y, transform: `rotate(${c.r})` }}
                />
              ))}
            </div>
          </div>

          {/* Posts feed */}
          {state.posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-tmc-100 flex items-center justify-center">
                      <span className="text-tmc-700 text-xs font-bold">
                        {state.profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-gray-700 font-semibold text-sm">{post.author}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{post.type}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{post.content}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => dispatch({ type: 'DELETE_POST', payload: post.id })} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* Right column - Tasks */}
        <div className="lg:col-span-1 space-y-4">
          {/* Tasks header tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex gap-3 mb-4">
              <button className="text-sm font-semibold text-gray-700 border-b-2 border-gray-700 pb-1">Assigned</button>
              <button className="text-sm font-medium text-gray-400 pb-1 border-b-2 border-transparent">Unassigned</button>
            </div>

            <div className="bg-tmc-50 border border-tmc-200 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-xs">Project Code: 939</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    0 hrs &bull; {state.tasks.length} tasks
                  </div>
                </div>
                <svg className="w-4 h-4 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>

            <div className="text-gray-500 text-xs font-medium mb-2">Tasks for 939:</div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {state.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 py-1.5">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      task.confirmed ? 'bg-tmc-500 border-tmc-500' : 'border-gray-300 hover:border-tmc-400'
                    }`}
                  >
                    {task.confirmed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-xs leading-relaxed ${task.confirmed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs font-semibold flex-shrink-0 ${task.confirmed ? 'text-tmc-500' : 'text-amber-500'}`}>
                    {task.confirmed ? 'Confirmed' : 'In-Progress'}
                  </span>
                </div>
              ))}
            </div>

            {/* Add task */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="Add new task..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-tmc-400"
              />
              <button onClick={addTask} className="bg-tmc-500 hover:bg-tmc-600 text-white px-3 py-2 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Punch Modal */}
      {showMissingPunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMissingPunchModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Missing Punch Request</h3>
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
