import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";

export default function IssuesList({ labels, status }) {
  const { isLoading, data } = useQuery(["issues", { labels, status }], () => {
    const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
    const statusString = status ? `&status=${status}` : "";
    return fetch(`/api/issues?${labelsString}${statusString}`).then((res) =>
      res.json()
    );
  });

  return (
    <div>
      <h1>Issues List</h1>
      {isLoading ? (
        <p className="loading">Loading....</p>
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
