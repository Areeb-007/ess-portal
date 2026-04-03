import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2.5 border-b border-white/10 last:border-0">
      <span className="text-slate-400 text-xs font-medium sm:w-44 flex-shrink-0 mb-0.5 sm:mb-0">{label}</span>
      <span className="text-white text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="glass-card p-6">
      <h2 className="section-title flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function Profile() {
  const { state, dispatch } = useApp()
  const { profile, family, allocated } = state

  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const [familyForm, setFamilyForm] = useState({ name: '', relation: '', dob: '' })

  const [showAllocatedForm, setShowAllocatedForm] = useState(false)
  const [allocatedForm, setAllocatedForm] = useState({ item: '', serialNo: '', assignedDate: '' })

  function addFamily() {
    if (!familyForm.name.trim() || !familyForm.relation.trim()) return
    dispatch({ type: 'ADD_FAMILY', payload: { id: Date.now(), ...familyForm } })
    setFamilyForm({ name: '', relation: '', dob: '' })
    setShowFamilyForm(false)
  }

  function addAllocated() {
    if (!allocatedForm.item.trim()) return
    dispatch({ type: 'ADD_ALLOCATED', payload: { id: Date.now(), ...allocatedForm } })
    setAllocatedForm({ item: '', serialNo: '', assignedDate: '' })
    setShowAllocatedForm(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 flex-shrink-0">
            <span className="text-white text-2xl font-bold">MI</span>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-blue-300 font-medium mt-0.5">{profile.designation}</p>
            <p className="text-slate-400 text-sm">{profile.department} &bull; {profile.location}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="badge-approved">EMP-{profile.employeeCode}</span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">{profile.grade}</span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">{profile.workType}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section
          title="Personal Information"
          icon={
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <InfoRow label="Employee Code" value={profile.employeeCode} />
          <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
          <InfoRow label="Gender" value={profile.gender} />
          <InfoRow label="Marital Status" value={profile.maritalStatus} />
          <InfoRow label="CNIC" value={profile.cnic} />
          <InfoRow label="Religion" value={profile.religion} />
          <InfoRow label="Nationality" value={profile.nationality} />
        </Section>

        {/* Employment Details */}
        <Section
          title="Employment Details"
          icon={
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        >
          <InfoRow label="Department" value={profile.department} />
          <InfoRow label="Designation" value={profile.designation} />
          <InfoRow label="Grade" value={profile.grade} />
          <InfoRow label="Joining Date" value={profile.joiningDate} />
          <InfoRow label="Service Period" value={profile.servicePeriod} />
          <InfoRow label="Shift" value={profile.shift} />
          <InfoRow label="Work Type" value={profile.workType} />
        </Section>

        {/* Contact & Financial */}
        <Section
          title="Contact & Financial"
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
        >
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Phone" value={profile.phone} />
          <InfoRow label="Location" value={profile.location} />
          <InfoRow label="GL Code" value={profile.gl} />
          <InfoRow label="IBAN" value={profile.iban} />
        </Section>

        {/* Hierarchy */}
        <Section
          title="Hierarchy"
          icon={
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        >
          <InfoRow label="Hierarchy / Title" value={profile.hierarchy} />
          <InfoRow label="Report To" value={profile.reportTo} />
          <InfoRow label="HRBP" value={profile.hrbp} />
        </Section>
      </div>

      {/* Family Information */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0 flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Family Information
          </h2>
          <button onClick={() => setShowFamilyForm(!showFamilyForm)} className="btn-primary text-sm">
            {showFamilyForm ? 'Cancel' : '+ Add Member'}
          </button>
        </div>

        {showFamilyForm && (
          <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label-text">Full Name</label>
              <input value={familyForm.name} onChange={e => setFamilyForm(f => ({ ...f, name: e.target.value }))} placeholder="Member name" className="input-field" />
            </div>
            <div>
              <label className="label-text">Relation</label>
              <select value={familyForm.relation} onChange={e => setFamilyForm(f => ({ ...f, relation: e.target.value }))} className="input-field">
                <option value="">Select relation</option>
                <option>Spouse</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Brother</option>
                <option>Sister</option>
              </select>
            </div>
            <div>
              <label className="label-text">Date of Birth</label>
              <input type="date" value={familyForm.dob} onChange={e => setFamilyForm(f => ({ ...f, dob: e.target.value }))} className="input-field" />
            </div>
            <div className="sm:col-span-3">
              <button onClick={addFamily} className="btn-primary">Add Family Member</button>
            </div>
          </div>
        )}

        {family.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No family members added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Name</th>
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Relation</th>
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Date of Birth</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {family.map(m => (
                  <tr key={m.id} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 pr-4 text-white font-medium">{m.name}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{m.relation}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{m.dob || '—'}</td>
                    <td className="py-2.5">
                      <button onClick={() => dispatch({ type: 'DELETE_FAMILY', payload: m.id })} className="btn-danger text-xs px-2 py-1">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocated Assets */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
            Allocated Assets
          </h2>
          <button onClick={() => setShowAllocatedForm(!showAllocatedForm)} className="btn-primary text-sm">
            {showAllocatedForm ? 'Cancel' : '+ Add Asset'}
          </button>
        </div>

        {showAllocatedForm && (
          <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label-text">Asset / Item</label>
              <input value={allocatedForm.item} onChange={e => setAllocatedForm(f => ({ ...f, item: e.target.value }))} placeholder="e.g., Laptop, ID Card" className="input-field" />
            </div>
            <div>
              <label className="label-text">Serial No.</label>
              <input value={allocatedForm.serialNo} onChange={e => setAllocatedForm(f => ({ ...f, serialNo: e.target.value }))} placeholder="Serial number" className="input-field" />
            </div>
            <div>
              <label className="label-text">Assigned Date</label>
              <input type="date" value={allocatedForm.assignedDate} onChange={e => setAllocatedForm(f => ({ ...f, assignedDate: e.target.value }))} className="input-field" />
            </div>
            <div className="sm:col-span-3">
              <button onClick={addAllocated} className="btn-primary">Add Asset</button>
            </div>
          </div>
        )}

        {allocated.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No assets allocated yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Item</th>
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Serial No.</th>
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Assigned Date</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {allocated.map(a => (
                  <tr key={a.id} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 pr-4 text-white font-medium">{a.item}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{a.serialNo || '—'}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{a.assignedDate || '—'}</td>
                    <td className="py-2.5">
                      <button onClick={() => dispatch({ type: 'DELETE_ALLOCATED', payload: a.id })} className="btn-danger text-xs px-2 py-1">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
