import { useQuery, useQueryClient } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";
import { fetchWithError } from "../helpers/fetchWithError";
import Loader from "./Loader";

export default function IssuesList({ labels, status, pageNum, setPageNum }) {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const issuesListQuery = useQuery(
    ["issues", { labels, status, page: pageNum }],
    async ({ signal }) => {
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      const statusString = status ? `&status=${status}` : "";
      const page = pageNum ? `&page=${pageNum}` : "";
      const results = await fetchWithError(
        `/api/issues?${labelsString}${statusString}${page}`,
        {
          signal,
        }
      );

      results.forEach((issue) =>
        queryClient.setQueryData(["issues", issue.number.toString()], issue)
      );

      return results;
    },
    {
      keepPreviousData: true,
    }
  );
  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    async ({ signal }) => {
      return fetch(`/api/search/issues?q=${searchValue}`, {
        signal,
      }).then((res) => res.json());
    },
    {
      enabled: !!searchValue,
    }
  );

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
        <>
          <h2>Issues List {issuesListQuery.isFetching ? <Loader /> : null}</h2>
          <ul className="issues-list">
            {issuesListQuery.data.map((issue) => (
              <IssueItem
                key={issue.id}
                commentCount={issue.comments.length}
                {...issue}
              />
            ))}
          </ul>
          <div className="pagination">
            <button
              disabled={pageNum === 1}
              onClick={() => setPageNum(pageNum - 1)}
            >
              Previous
            </button>
            Page {pageNum} {issuesListQuery.isFetching ? "..." : ""}
            <button
              disabled={
                issuesListQuery.data.length === 0 ||
                issuesListQuery.isPreviousData
              }
              onClick={() => {
                if (
                  issuesListQuery.data.length > 0 &&
                  !issuesListQuery.isPreviousData
                ) {
                  setPageNum(pageNum + 1);
                }
              }}
            >
              Next
            </button>
          </div>
        </>
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
