export const possibleStatus = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "inProgress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "cancelled", label: "Cancelled" },
];
export function StatusSelect({ value, onChange, noEmptyOption = false }) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      {noEmptyOption ? null : <option value="">Select a status</option>}

      {possibleStatus.map((status) => (
        <option key={status.id} value={status.id} className="status-option">
          {status.label}
        </option>
      ))}
    </select>
  );
}
