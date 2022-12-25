import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";

export default function IssuesList() {
  const { isLoading, data } = useQuery(["issues"], () =>
    fetch("/api/issues").then((res) => res.json())
  );
  console.log({ data });

  return (
    <div>
      <h1>Issues List</h1>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <ul className="issues-list">
          {data.map((issue) => (
            <IssueItem
              key={issue.id}
              commentCount={issue.comments.length}
              {...issue}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
