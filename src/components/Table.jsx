export default function Table({ columns, rows, onEdit, onDelete, onView }) {
  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-md">
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
          {rows.map((row, idx) => (
            <tr key={row.id} className={`transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 border-b border-gray-100 text-gray-700">
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
    </div>
  )
}
