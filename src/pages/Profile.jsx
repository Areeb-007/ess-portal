import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 text-sm font-medium text-right">{value || '—'}</span>
    </div>
  )
}

export default function Profile() {
  const { state, dispatch } = useApp()
  const { profile, family, allocated } = state
  const [activeTab, setActiveTab] = useState('personal')

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

  const initials = profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'MI'

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">
      {/* Left card: avatar + quick info */}
      <div className="w-56 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <span className="text-amber-800 text-2xl font-bold">{initials}</span>
          </div>
          <h2 className="text-gray-800 font-bold text-base">{profile.name}</h2>
          <p className="text-tmc-500 text-sm font-medium mt-0.5">{profile.designation}</p>

          <div className="w-full border-t border-gray-100 mt-4 pt-4 space-y-3 text-left">
            <div>
              <div className="text-gray-400 text-xs">Service Period</div>
              <div className="text-gray-700 text-sm font-medium mt-0.5">{profile.servicePeriod}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Email</div>
              <div className="text-gray-700 text-xs font-medium mt-0.5 break-all">{profile.email}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Phone</div>
              <div className="text-gray-700 text-sm font-medium mt-0.5">{profile.phone}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Location</div>
              <div className="text-gray-700 text-sm font-medium mt-0.5">{profile.location}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Hierarchy</div>
              <div className="text-gray-700 text-xs font-medium mt-0.5">{profile.hierarchy}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: tabs + content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center border-b border-gray-100 px-6 pt-2">
            {[
              { key: 'personal', label: 'Personal Information' },
              { key: 'work', label: 'Work Information' },
              { key: 'family', label: 'My Requests' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors mr-2 ${
                  activeTab === tab.key
                    ? 'border-tmc-500 text-tmc-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button className="ml-auto mb-2 flex items-center gap-1.5 bg-tmc-500 hover:bg-tmc-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'personal' && (
              <div>
                <InfoRow label="Employee Code" value={profile.employeeCode} />
                <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
                <InfoRow label="Marital Status" value={profile.maritalStatus} />
                <InfoRow label="Gender" value={profile.gender} />
                <InfoRow label="CNIC" value={profile.cnic} />
                <InfoRow label="GL" value={profile.gl} />
                <InfoRow label="Religion" value={profile.religion} />
                <InfoRow label="Nationality" value={profile.nationality} />
                <InfoRow label="IBAN" value={profile.iban} />
              </div>
            )}

            {activeTab === 'work' && (
              <div>
                <InfoRow label="Department" value={profile.department} />
                <InfoRow label="Designation" value={profile.designation} />
                <InfoRow label="Grade" value={profile.grade} />
                <InfoRow label="Joining Date" value={profile.joiningDate} />
                <InfoRow label="Service Period" value={profile.servicePeriod} />
                <InfoRow label="Shift" value={profile.shift} />
                <InfoRow label="Work Type" value={profile.workType} />
                <InfoRow label="Report To" value={profile.reportTo} />
                <InfoRow label="HRBP" value={profile.hrbp} />
              </div>
            )}

            {activeTab === 'family' && (
              <div className="space-y-6">
                {/* Family Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold">Family Information</h3>
                    <button onClick={() => setShowFamilyForm(!showFamilyForm)} className="btn-primary text-sm">
                      {showFamilyForm ? 'Cancel' : '+ Add Member'}
                    </button>
                  </div>

                  {showFamilyForm && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="label-text">Full Name</label>
                        <input value={familyForm.name} onChange={e => setFamilyForm(f => ({ ...f, name: e.target.value }))} placeholder="Member name" className="input-field" />
                      </div>
                      <div>
                        <label className="label-text">Relation</label>
                        <select value={familyForm.relation} onChange={e => setFamilyForm(f => ({ ...f, relation: e.target.value }))} className="input-field">
                          <option value="">Select relation</option>
                          <option>Spouse</option><option>Son</option><option>Daughter</option>
                          <option>Father</option><option>Mother</option><option>Brother</option><option>Sister</option>
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
                    <div className="text-center py-8 text-gray-400 text-sm">No family members added yet.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-gray-500 font-medium pb-2 pr-4">Name</th>
                          <th className="text-left text-gray-500 font-medium pb-2 pr-4">Relation</th>
                          <th className="text-left text-gray-500 font-medium pb-2 pr-4">Date of Birth</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {family.map(m => (
                          <tr key={m.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 pr-4 text-gray-800 font-medium">{m.name}</td>
                            <td className="py-2.5 pr-4 text-gray-600">{m.relation}</td>
                            <td className="py-2.5 pr-4 text-gray-600">{m.dob || '—'}</td>
                            <td className="py-2.5">
                              <button onClick={() => dispatch({ type: 'DELETE_FAMILY', payload: m.id })} className="btn-danger text-xs px-2 py-1">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Allocated Assets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold">Allocated Assets</h3>
                    <button onClick={() => setShowAllocatedForm(!showAllocatedForm)} className="btn-primary text-sm">
                      {showAllocatedForm ? 'Cancel' : '+ Add Asset'}
                    </button>
                  </div>

                  {showAllocatedForm && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="label-text">Asset / Item</label>
                        <input value={allocatedForm.item} onChange={e => setAllocatedForm(f => ({ ...f, item: e.target.value }))} placeholder="e.g., Laptop" className="input-field" />
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
                    <div className="text-center py-8 text-gray-400 text-sm">No assets allocated yet.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-gray-500 font-medium pb-2 pr-4">Item</th>
                          <th className="text-left text-gray-500 font-medium pb-2 pr-4">Serial No.</th>
                          <th className="text-left text-gray-500 font-medium pb-2 pr-4">Assigned Date</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocated.map(a => (
                          <tr key={a.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 pr-4 text-gray-800 font-medium">{a.item}</td>
                            <td className="py-2.5 pr-4 text-gray-600">{a.serialNo || '—'}</td>
                            <td className="py-2.5 pr-4 text-gray-600">{a.assignedDate || '—'}</td>
                            <td className="py-2.5">
                              <button onClick={() => dispatch({ type: 'DELETE_ALLOCATED', payload: a.id })} className="btn-danger text-xs px-2 py-1">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
