import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";
import { fetchWithError } from "../helpers/fetchWithError";

export default function IssuesList({ labels, status }) {
  const [searchValue, setSearchValue] = useState("");
  const issuesListQuery = useQuery(["issues", { labels, status }], () => {
    const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
    const statusString = status ? `&status=${status}` : "";
    return fetchWithError(`/api/issues?${labelsString}${statusString}`, {
      headers: {
        "x-error": true,
      },
    });
  });
  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    async () => {
      return fetch(`/api/search/issues?q=${searchValue}`).then((res) =>
        res.json()
      );
    },
    {
      enabled: !!searchValue,
    }
  );
  console.log(issuesListQuery);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchValue(e.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          id="search"
          name="search"
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setSearchValue("");
            }
          }}
        />
      </form>

      {issuesListQuery.isLoading ? (
        <p className="loading">Loading....</p>
      ) : issuesListQuery.isError ? (
        <p>{issuesListQuery.error.message}</p>
      ) : !searchValue ? (
        <ul className="issues-list">
          {issuesListQuery.data.map((issue) => (
            <IssueItem
              key={issue.id}
              commentCount={issue.comments.length}
              {...issue}
            />
          ))}
        </ul>
      ) : (
        <>
          <h2>Search Results</h2>

          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="issues-list">
              <p>{searchQuery.data.count} Results</p>
              {searchQuery.data?.items?.map((issue) => (
                <IssueItem
                  key={issue.id}
                  commentCount={issue.comments.length}
                  {...issue}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
