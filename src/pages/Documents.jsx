import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext.jsx'

const CATEGORIES = ['Policies', 'HR Policy', 'IT Policy', 'Compensation', 'Health & Safety', 'Travel Policy', 'Compliance', 'Other']

const EMPTY_FORM = { category: 'Policies', title: '', dateUploaded: '', description: '' }

function FilePreviewModal({ doc, onClose }) {
  if (!doc) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-gray-800 font-semibold">{doc.title}</h3>
            <p className="text-gray-500 text-xs">{doc.category}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {doc.fileBase64 && doc.fileType?.startsWith('image/') ? (
            <img src={doc.fileBase64} alt={doc.title} className="max-w-full mx-auto rounded-xl" />
          ) : doc.fileBase64 && doc.fileType === 'application/pdf' ? (
            <iframe src={doc.fileBase64} title={doc.title} className="w-full h-[60vh] rounded-xl bg-white" />
          ) : doc.fileBase64 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-tmc-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-tmc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium mb-2">{doc.title}</p>
              <p className="text-gray-500 text-sm mb-4">Preview not available for this file type.</p>
              <a href={doc.fileBase64} download={doc.title} className="btn-primary inline-block">Download File</a>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium mb-1">{doc.title}</p>
              <p className="text-gray-500 text-sm">{doc.description}</p>
              <p className="text-gray-400 text-xs mt-2">No file attached to this document.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Documents() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fileData, setFileData] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFileData({ base64: ev.target.result, type: file.type, name: file.name })
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.category) return
    dispatch({
      type: 'ADD_DOCUMENT',
      payload: {
        id: Date.now(),
        ...form,
        dateUploaded: form.dateUploaded || new Date().toISOString().slice(0, 10),
        fileBase64: fileData?.base64 || null,
        fileType: fileData?.type || null,
        fileName: fileData?.name || null,
      }
    })
    setForm(EMPTY_FORM)
    setFileData(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowForm(false)
  }

  const filtered = state.documents.filter(doc => {
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
        <h1 className="text-gray-800 font-bold text-lg">Document Center</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-tmc-400 w-48"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-8 h-8 bg-tmc-500 hover:bg-tmc-600 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors shadow-sm"
            title="Add Document"
          >
            +
          </button>
        </div>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-gray-800 font-semibold mb-4">Add Document</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Document title" className="input-field" />
            </div>
            <div>
              <label className="label-text">Date Uploaded</label>
              <input type="date" value={form.dateUploaded} onChange={e => setForm(f => ({ ...f, dateUploaded: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label-text">Attachment (optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-tmc-50 file:text-tmc-700 hover:file:bg-tmc-100 cursor-pointer"
              />
              {fileData && (
                <p className="text-tmc-600 text-xs mt-1">✓ {fileData.name}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of the document..."
                rows={2}
                className="input-field resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="btn-primary">Add Document</button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFileData(null) }} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-4 border-b border-gray-100">
          <button className="text-sm font-medium text-tmc-600 border-b-2 border-tmc-500 pb-3 px-1">
            Company Documents
          </button>
        </div>

        {/* Count */}
        <div className="px-6 py-3 text-gray-500 text-xs border-b border-gray-50">
          Showing {filtered.length} of {state.documents.length} documents
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No documents found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left text-gray-500 font-medium px-6 py-3 text-xs uppercase tracking-wider">Document Category</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Date Uploaded</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Description</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {/* Red PDF-style icon */}
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 16v-1h8v1H8zm0-3v-1h8v1H8zm0-3V9h5v1H8z"/>
                          </svg>
                        </div>
                        <span className="text-gray-600 text-xs font-medium">{doc.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="text-tmc-600 hover:text-tmc-700 font-medium hover:underline text-left"
                      >
                        {doc.title}
                      </button>
                      {doc.fileName && (
                        <div className="text-gray-400 text-xs">{doc.fileName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {doc.dateUploaded
                        ? new Date(doc.dateUploaded + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs">
                      <span className="line-clamp-2">{doc.description || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-gray-400 hover:text-tmc-600 transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {doc.fileBase64 && (
                          <a
                            href={doc.fileBase64}
                            download={doc.fileName || doc.title}
                            className="p-1.5 text-gray-400 hover:text-tmc-600 transition-colors"
                            title="Download"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={() => dispatch({ type: 'DELETE_DOCUMENT', payload: doc.id })}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  )
}
