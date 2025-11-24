

import { useState, useMemo } from 'react'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export default function Table({ columns, rows, onEdit, onDelete, onView, searchKey = '', searchPlaceholder = 'Search...', pageSize = 10 }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)

  // Filter rows by searchKey
  const filteredRows = useMemo(() => {
    if (!searchKey || !search) return rows
    return rows.filter(row => {
      const value = String(row[searchKey] ?? '').toLowerCase()
      return value.includes(search.toLowerCase())
    })
  }, [rows, search, searchKey])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / currentPageSize))
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * currentPageSize
    return filteredRows.slice(start, start + currentPageSize)
  }, [filteredRows, page, currentPageSize])

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handlePageChange(newPage) {
    setPage(newPage)
  }

  function handlePageSizeChange(e) {
    setCurrentPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-md">
      {/* Search and Page Size Controls */}
      <div className="p-3 flex flex-wrap justify-between items-center gap-2">
        {searchKey && (
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            className="border rounded px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500"
          />
        )}
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-700">Rows per page:</label>
          <select
            id="page-size"
            value={currentPageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-linear-to-r from-gray-50 to-gray-100 text-left">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete || onView) && <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, idx) => (
            <tr key={row.id} className={`transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              {columns.map((col) => (
                <td key={col.key} className="capitalize px-4 py-3 border-b border-gray-100 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="px-4 py-3 border-b border-gray-100">
                  <div className="flex gap-2">
                    {onView && (
                      <button className="px-3 py-1.5 rounded-lg bg-linear-to-r from-green-500 to-green-600 text-white text-xs font-medium hover:shadow-lg hover:scale-105 transition-all duration-200" onClick={() => onView(row)}>
                        View/Print
                      </button>
                    )}
                    {onEdit && (
                      <button className="px-3 py-1.5 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-medium hover:shadow-lg hover:scale-105 transition-all duration-200" onClick={() => onEdit(row)}>
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button className="px-3 py-1.5 rounded-lg bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-medium hover:shadow-lg hover:scale-105 transition-all duration-200" onClick={() => onDelete(row)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 p-3">
          <button
            className="px-2 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-2">Page {page} of {totalPages}</span>
          <button
            className="px-2 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
