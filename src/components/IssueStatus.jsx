import React from "react";
import { StatusSelect } from "./StatusSelect";
import { useMutation, useQueryClient } from "react-query";

const IssueStatus = ({ status, issueNumber }) => {
  const queryClient = useQueryClient();

  const setStatus = useMutation(
    (status) =>
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }),
    {
      onMutate: (status) => {
        const oldStatus = queryClient.getQueryData([
          "issues",
          issueNumber.toString(),
        ]).status;

        queryClient.setQueryData(
          ["issues", issueNumber.toString()],
          (data) => ({ ...data, status })
        );

        return function rollBack() {
          queryClient.setQueryData(
            ["issues", issueNumber.toString()],
            (data) => ({ ...data, status: oldStatus })
          );
        };
      },
      onError: (error, variables, rollBack) => {
        rollBack();
      },
      onSettled: () => {
        queryClient.invalidateQueries(["issues", issueNumber.toString()], {
          exact: true,
        });
      },
    }
  );

  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChange={(event) => setStatus.mutate(event.target.value)}
        />
      </div>
    </div>
  );
};

export default IssueStatus;
