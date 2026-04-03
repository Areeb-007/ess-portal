import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext.jsx'

const CATEGORIES = ['HR Policy', 'IT Policy', 'Compensation', 'Health & Safety', 'Travel Policy', 'Compliance', 'Other']

const EMPTY_FORM = { category: 'HR Policy', title: '', dateUploaded: '', description: '' }

function FilePreviewModal({ doc, onClose }) {
  if (!doc) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold">{doc.title}</h3>
            <p className="text-slate-400 text-xs">{doc.category}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {doc.fileBase64 && doc.fileType?.startsWith('image/') ? (
            <img src={doc.fileBase64} alt={doc.title} className="max-w-full mx-auto rounded-xl" />
          ) : doc.fileBase64 && doc.fileType === 'application/pdf' ? (
            <iframe
              src={doc.fileBase64}
              title={doc.title}
              className="w-full h-[60vh] rounded-xl bg-white"
            />
          ) : doc.fileBase64 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-2">{doc.title}</p>
              <p className="text-slate-400 text-sm mb-4">Preview not available for this file type.</p>
              <a href={doc.fileBase64} download={doc.title} className="btn-primary inline-block">
                Download File
              </a>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">{doc.title}</p>
              <p className="text-slate-400 text-sm">{doc.description}</p>
              <p className="text-slate-500 text-xs mt-2">No file attached to this document.</p>
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
  const [filterCategory, setFilterCategory] = useState('All')
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
    if (filterCategory !== 'All' && doc.category !== filterCategory) return false
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  function categoryBadge(category) {
    const map = {
      'HR Policy': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'IT Policy': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Compensation': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'Health & Safety': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Travel Policy': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'Compliance': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Other': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    }
    return `${map[category] || map['Other']} border px-2.5 py-0.5 rounded-full text-xs font-semibold`
  }

  function getFileIcon(doc) {
    if (!doc.fileType) return '📄'
    if (doc.fileType.startsWith('image/')) return '🖼️'
    if (doc.fileType === 'application/pdf') return '📑'
    if (doc.fileType.includes('word') || doc.fileType.includes('document')) return '📝'
    if (doc.fileType.includes('sheet') || doc.fileType.includes('excel')) return '📊'
    return '📎'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Document Center</h1>
          <p className="text-slate-400 text-sm mt-1">Access and manage company policy documents</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Document
          </button>
        )}
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Add Document</h2>
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
                className="block w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 cursor-pointer"
              />
              {fileData && (
                <p className="text-emerald-400 text-xs mt-1">✓ {fileData.name}</p>
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

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-sm py-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterCategory === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="text-slate-400 text-sm">
        Showing {filtered.length} of {state.documents.length} documents
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p>No documents found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {['Document Category', 'Title', 'Date Uploaded', 'Description', 'Actions'].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                      <span className={categoryBadge(doc.category)}>{doc.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFileIcon(doc)}</span>
                        <div>
                          <div className="text-white font-medium">{doc.title}</div>
                          {doc.fileName && (
                            <div className="text-slate-500 text-xs">{doc.fileName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {doc.dateUploaded
                        ? new Date(doc.dateUploaded + 'T00:00:00').toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">
                      <span className="line-clamp-2">{doc.description || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        >
                          View
                        </button>
                        {doc.fileBase64 && (
                          <a
                            href={doc.fileBase64}
                            download={doc.fileName || doc.title}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                          >
                            Download
                          </a>
                        )}
                        <button
                          onClick={() => dispatch({ type: 'DELETE_DOCUMENT', payload: doc.id })}
                          className="btn-danger text-xs px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview modal */}
      <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  )
}
