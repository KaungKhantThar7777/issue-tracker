import { useLabelsData } from "../helpers/useLabelsData";

export default function LabelList({ selected, toggle }) {
  const { isLoading, data } = useLabelsData();

  return (
    <div className="labels">
      <h3>Labels</h3>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((label) => (
            <li key={label.id}>
              <button
                onClick={() => toggle(label.id)}
                className={`label ${
                  selected.includes(label.id) ? "selected" : ""
                } ${label.color}`}
              >
                {" "}
                {label.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
