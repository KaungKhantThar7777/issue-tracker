import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { possibleStatus } from "./StatusSelect";
import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";

export const IssueHeader = ({
  title,
  number,
  status = "todo",
  createdBy,
  createdDate,
  comments,
}) => {
  const statusObj = possibleStatus.find((pStatus) => pStatus.id === status);
  const createdByUser = useUserData(createdBy);
  return (
    <header>
      <h2>
        {title} <span>#{number}</span>
      </h2>
      <div>
        <span
          className={
            status === "done" || status === "cancelled" ? "closed" : "open"
          }
        >
          {status === "done" || status === "cancelled" ? (
            <GoIssueClosed />
          ) : (
            <GoIssueOpened />
          )}
          {statusObj.label}
        </span>
        <span className="created-by">
          {createdByUser.isLoading ? <p>...</p> : createdByUser.data?.name}
        </span>{" "}
        opened this issue {relativeDate(createdDate)} - {comments.length}{" "}
        comments
      </div>
    </header>
  );
};
