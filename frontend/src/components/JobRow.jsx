import React from 'react';

function JobRow({ job, editingJob, openNotesId, handleCellDoubleClick, handleCellChange, handleCellBlurOrEnter, setOpenNotesId, setEditingJob, handleDelete }) {
  return (
    <tr className="align-middle">
      <td className="py-2 px-4 text-center" style={{width: '12%', height: '40px', overflow: 'hidden', verticalAlign: 'middle'}} onDoubleClick={() => handleCellDoubleClick(job._id, 'createdAt', job.createdAt ? new Date(job.createdAt).toISOString().slice(0,10) : '')}>
        {editingJob && editingJob.jobId === job._id && editingJob.field === 'createdAt' ? (
          <input
            type="date"
            value={editingJob.value}
            autoFocus
            onChange={handleCellChange}
            onBlur={handleCellBlurOrEnter}
            onKeyDown={e => { if (e.key === 'Enter') handleCellBlurOrEnter(); }}
            className="bg-transparent text-white px-1 w-full text-xs focus:outline-none"
            style={{ border: 'none', minWidth: 0, width: '100%', height: '24px' }}
          />
        ) : (
          job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-CA') : ''
        )}
      </td>
      <td className="py-2 px-4 text-center" style={{width: '22%', height: '40px', overflow: 'hidden', verticalAlign: 'middle'}} onDoubleClick={() => handleCellDoubleClick(job._id, 'title', job.title)}>
        {editingJob && editingJob.jobId === job._id && editingJob.field === 'title' ? (
          <input
            type="text"
            value={editingJob.value}
            autoFocus
            onChange={handleCellChange}
            onBlur={handleCellBlurOrEnter}
            onKeyDown={e => { if (e.key === 'Enter') handleCellBlurOrEnter(); }}
            className="bg-transparent text-white px-1 w-full text-xs focus:outline-none"
            style={{ border: 'none', minWidth: 0, width: '100%', height: '24px' }}
          />
        ) : <span style={{display: 'inline-block', minWidth: 0, width: '100%', height: '24px', verticalAlign: 'middle', lineHeight: '24px'}}>{job.title}</span>}
      </td>
      <td className="py-2 px-4 text-center" style={{width: '22%', height: '40px', overflow: 'hidden', verticalAlign: 'middle'}} onDoubleClick={() => handleCellDoubleClick(job._id, 'company', job.company)}>
        {editingJob && editingJob.jobId === job._id && editingJob.field === 'company' ? (
          <input
            type="text"
            value={editingJob.value}
            autoFocus
            onChange={handleCellChange}
            onBlur={handleCellBlurOrEnter}
            onKeyDown={e => { if (e.key === 'Enter') handleCellBlurOrEnter(); }}
            className="bg-transparent text-white px-1 w-full text-xs focus:outline-none"
            style={{ border: 'none', minWidth: 0, width: '100%', height: '24px' }}
          />
        ) : <span style={{display: 'inline-block', minWidth: 0, width: '100%', height: '24px', verticalAlign: 'middle', lineHeight: '24px'}}>{job.company}</span>}
      </td>
      <td className="py-2 px-4 text-center" style={{width: '14%', height: '40px', overflow: 'hidden', verticalAlign: 'middle'}} onDoubleClick={() => handleCellDoubleClick(job._id, 'status', job.status)}>
        {editingJob && editingJob.jobId === job._id && editingJob.field === 'status' ? (
          <input
            type="text"
            value={editingJob.value}
            autoFocus
            onChange={handleCellChange}
            onBlur={handleCellBlurOrEnter}
            onKeyDown={e => { if (e.key === 'Enter') handleCellBlurOrEnter(); }}
            className="bg-transparent text-white px-1 w-full text-xs focus:outline-none"
            style={{ border: 'none', minWidth: 0, width: '100%', height: '24px' }}
          />
        ) : <span style={{display: 'inline-block', minWidth: 0, width: '100%', height: '24px', verticalAlign: 'middle', lineHeight: '24px'}}>{job.status}</span>}
      </td>
      <td className="py-2 px-4 text-center relative" style={{width: '14%', verticalAlign: 'middle'}}>
        <span
          style={{ cursor: 'pointer', display: 'inline-block' }}
          onClick={() => setOpenNotesId(openNotesId === job._id ? null : job._id)}
          title="View/Edit Notes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="inline-block align-middle text-blue-400">
            <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h8v16zm-2-8h-4v2h4v-2zm0-4h-4v2h4V8z"/>
          </svg>
        </span>
        {openNotesId === job._id && (
          <div className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 bg-[#232323] border border-[#6c6c6c] rounded shadow-lg p-4 w-64 text-white" style={{ minWidth: '200px' }}>
            <textarea
              value={editingJob && editingJob.jobId === job._id && editingJob.field === 'notes' ? editingJob.value : job.notes || ''}
              onChange={e => setEditingJob({ jobId: job._id, field: 'notes', value: e.target.value })}
              onBlur={handleCellBlurOrEnter}
              rows={4}
              className="w-full bg-[#232323] text-white rounded p-2 text-sm border border-[#6c6c6c]"
              autoFocus
            />
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2"
                onClick={handleCellBlurOrEnter}
              >Save</button>
              <button
                className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => { setOpenNotesId(null); setEditingJob(null); }}
              >Close</button>
            </div>
          </div>
        )}
      </td>
      <td className="py-2 px-4 text-center flex gap-2" style={{width: '8%', verticalAlign: 'middle'}}>
        <button
          className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center justify-center"
          onClick={() => handleDelete(job._id)}
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3V6zm2 3h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm5 2v7h2v-7h-2z"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default JobRow;
