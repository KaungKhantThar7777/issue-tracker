import React from "react";
import { useLabelsData } from "../helpers/useLabelsData";
import { useState } from "react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { GoGear } from "react-icons/go";

const IssueLabels = ({ labels, issueNumber }) => {
  const queryClient = useQueryClient();
  const labelsQuery = useLabelsData();
  const [menuOpen, setMenuOpen] = useState(false);

  const setLabels = useMutation(
    (labelId) => {
      const newLabels = labels.includes(labelId)
        ? labels.filter((label) => label !== labelId)
        : [...labels, labelId];
      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          labels: newLabels,
        }),
      });
    },
    {
      onMutate: (labelId) => {
        const oldLabels = queryClient.getQueryData([
          "issues",
          issueNumber.toString(),
        ]).labels;

        const newLabels = oldLabels.includes(labelId)
          ? oldLabels.filter((label) => label !== labelId)
          : [...oldLabels, labelId];

        queryClient.setQueryData(
          ["issues", issueNumber.toString()],
          (data) => ({
            ...data,
            labels: newLabels,
          })
        );

        return function rollbackFn() {
          queryClient.invalidateQueries(
            ["issues", issueNumber.toString()],
            (data) => ({
              ...data,
              labels: oldLabels,
            })
          );
        };
      },
      onError: (error, variables, rollback) => {
        rollback();
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
        <span>Labels</span>
        {labelsQuery.isLoading
          ? null
          : labels.map((labelId) => {
              const labelObj = labelsQuery.data.find(
                (label) => label.id === labelId
              );

              return (
                <span key={labelId} className={`label ${labelObj.color}`}>
                  {labelObj.name}
                </span>
              );
            })}
      </div>

      <GoGear
        onClick={() => !labelsQuery.isLoading && setMenuOpen((open) => !open)}
      />

      {menuOpen && (
        <div className="picker-menu labels">
          {labelsQuery.data.map((label) => {
            const selected = labels.includes(label.id);
            return (
              <div
                key={label.id}
                className={selected ? "selected" : ""}
                onClick={() => setLabels.mutate(label.id)}
              >
                <span
                  className="label-dot"
                  style={{
                    background: label.color,
                  }}
                ></span>
                {label.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IssueLabels;
