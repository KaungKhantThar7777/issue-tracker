import { useState } from "react";
import { useUserData } from "../helpers/useUserData";
import { GoGear } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function IssueAssignment({ assignee, issueNumber }) {
  const user = useUserData(assignee);
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const usersQuery = useQuery(["users"], () =>
    fetch("/api/users").then((res) => res.json())
  );
  console.log({ usersQuery });
  const setAssignee = useMutation(
    (assignee) =>
      fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        body: JSON.stringify({ assignee }),
      }),
    {
      onMutate: (assignee) => {
        const oldAssignee = queryClient.getQueryData([
          "issues",
          issueNumber.toString(),
        ]).assignee;

        queryClient.setQueryData(
          ["issues", issueNumber.toString()],
          (data) => ({
            ...data,
            assignee,
          })
        );

        return function rollBack() {
          queryClient.setQueryData(
            ["issues", issueNumber.toString()],
            (data) => ({
              ...data,
              assignee: oldAssignee,
            })
          );
        };
      },
      onError: (errors, variables, rollBack) => {
        rollBack();
      },
      onSettled: (errors, variables, rollBack) => {
        queryClient.invalidateQueries(["issues", issueNumber.toString()], {
          exact: true,
        });
      },
    }
  );

  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {user.isSuccess && (
          <div>
            <img src={user.data.profilePictureUrl} alt="user avatar" />
            {user.data.name}
          </div>
        )}
      </div>

      <GoGear
        onClick={() => !usersQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen ? (
        <div className="picker-menu">
          {usersQuery.data?.map((user) => (
            <div key={user.id} onClick={() => setAssignee.mutate(user.id)}>
              <img src={user.profilePictureUrl} alt="user avatar" />

              {user.name}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
