import React, { createContext, useContext, useReducer, useEffect } from 'react'
import {
  mockProfile, mockTasks, mockAttendance, mockDocuments,
  mockFamily, mockAllocated, mockPosts, mockRequests,
  mockTimesheet, mockCompensations
} from '../data/mockData.js'

const AppContext = createContext(null)

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function getInitialState() {
  return {
    auth: loadFromStorage('ess_auth', { isLoggedIn: false, user: null }),
    profile: loadFromStorage('ess_profile', mockProfile),
    tasks: loadFromStorage('ess_tasks', mockTasks),
    attendance: loadFromStorage('ess_attendance', mockAttendance),
    documents: loadFromStorage('ess_documents', mockDocuments),
    family: loadFromStorage('ess_family', mockFamily),
    allocated: loadFromStorage('ess_allocated', mockAllocated),
    posts: loadFromStorage('ess_posts', mockPosts),
    requests: loadFromStorage('ess_requests', mockRequests),
    timesheet: loadFromStorage('ess_timesheet', mockTimesheet),
    compensations: loadFromStorage('ess_compensations', mockCompensations),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, auth: { isLoggedIn: true, user: action.payload } }
    case 'LOGOUT':
      return { ...state, auth: { isLoggedIn: false, user: null } }
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } }

    // Tasks
    case 'TOGGLE_TASK': {
      const tasks = state.tasks.map(t =>
        t.id === action.payload ? { ...t, confirmed: !t.confirmed } : t
      )
      return { ...state, tasks }
    }
    case 'ADD_TASK': {
      const tasks = [...state.tasks, action.payload]
      return { ...state, tasks }
    }
    case 'DELETE_TASK': {
      const tasks = state.tasks.filter(t => t.id !== action.payload)
      return { ...state, tasks }
    }

    // Posts
    case 'ADD_POST': {
      const posts = [action.payload, ...state.posts]
      return { ...state, posts }
    }
    case 'DELETE_POST': {
      const posts = state.posts.filter(p => p.id !== action.payload)
      return { ...state, posts }
    }

    // Requests
    case 'ADD_REQUEST': {
      const requests = [action.payload, ...state.requests]
      return { ...state, requests }
    }
    case 'UPDATE_REQUEST_STATUS': {
      const requests = state.requests.map(r =>
        r.id === action.payload.id ? { ...r, status: action.payload.status } : r
      )
      return { ...state, requests }
    }
    case 'DELETE_REQUEST': {
      const requests = state.requests.filter(r => r.id !== action.payload)
      return { ...state, requests }
    }

    // Attendance
    case 'ADD_ATTENDANCE': {
      const attendance = [action.payload, ...state.attendance]
      return { ...state, attendance }
    }
    case 'UPDATE_ATTENDANCE': {
      const attendance = state.attendance.map(a =>
        a.id === action.payload.id ? action.payload : a
      )
      return { ...state, attendance }
    }
    case 'DELETE_ATTENDANCE': {
      const attendance = state.attendance.filter(a => a.id !== action.payload)
      return { ...state, attendance }
    }
    case 'MARK_MISSING_PUNCH': {
      const attendance = state.attendance.map(a =>
        a.date === action.payload ? { ...a, missingPunchRequested: true } : a
      )
      return { ...state, attendance }
    }

    // Timesheet
    case 'ADD_TIMESHEET': {
      const timesheet = [action.payload, ...state.timesheet]
      return { ...state, timesheet }
    }
    case 'UPDATE_TIMESHEET': {
      const timesheet = state.timesheet.map(t =>
        t.id === action.payload.id ? action.payload : t
      )
      return { ...state, timesheet }
    }
    case 'DELETE_TIMESHEET': {
      const timesheet = state.timesheet.filter(t => t.id !== action.payload)
      return { ...state, timesheet }
    }

    // Compensation
    case 'ADD_COMPENSATION': {
      const compensations = [action.payload, ...state.compensations]
      return { ...state, compensations }
    }
    case 'DELETE_COMPENSATION': {
      const compensations = state.compensations.filter(c => c.id !== action.payload)
      return { ...state, compensations }
    }

    // Documents
    case 'ADD_DOCUMENT': {
      const documents = [...state.documents, action.payload]
      return { ...state, documents }
    }
    case 'DELETE_DOCUMENT': {
      const documents = state.documents.filter(d => d.id !== action.payload)
      return { ...state, documents }
    }

    // Family
    case 'ADD_FAMILY': {
      const family = [...state.family, action.payload]
      return { ...state, family }
    }
    case 'DELETE_FAMILY': {
      const family = state.family.filter(f => f.id !== action.payload)
      return { ...state, family }
    }

    // Allocated
    case 'ADD_ALLOCATED': {
      const allocated = [...state.allocated, action.payload]
      return { ...state, allocated }
    }
    case 'DELETE_ALLOCATED': {
      const allocated = state.allocated.filter(a => a.id !== action.payload)
      return { ...state, allocated }
    }

    // Check in/out from dashboard
    case 'CHECK_IN': {
      const today = action.payload.date
      const exists = state.attendance.find(a => a.date === today)
      if (exists) {
        const attendance = state.attendance.map(a =>
          a.date === today ? { ...a, checkIn: action.payload.time } : a
        )
        return { ...state, attendance }
      }
      const attendance = [
        { id: Date.now(), date: today, checkIn: action.payload.time, checkOut: null, status: 'Present', missingPunchRequested: false },
        ...state.attendance
      ]
      return { ...state, attendance }
    }
    case 'CHECK_OUT': {
      const today = action.payload.date
      const attendance = state.attendance.map(a =>
        a.date === today ? { ...a, checkOut: action.payload.time } : a
      )
      return { ...state, attendance }
    }

    default:
      return state
  }
}

const STORAGE_MAP = {
  auth: 'ess_auth',
  profile: 'ess_profile',
  tasks: 'ess_tasks',
  attendance: 'ess_attendance',
  documents: 'ess_documents',
  family: 'ess_family',
  allocated: 'ess_allocated',
  posts: 'ess_posts',
  requests: 'ess_requests',
  timesheet: 'ess_timesheet',
  compensations: 'ess_compensations',
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  useEffect(() => {
    Object.entries(STORAGE_MAP).forEach(([key, storageKey]) => {
      localStorage.setItem(storageKey, JSON.stringify(state[key]))
    })
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
