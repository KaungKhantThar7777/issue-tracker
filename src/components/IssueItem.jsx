import { Link } from "react-router-dom";
import { GoComment, GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";
import { Label } from "./Label";

export const IssueItem = ({
  title,
  number,
  labels,
  createdBy,
  commentCount,
  status,
  createdDate,
  assignee,
}) => {
  const createdByUser = useUserData(createdBy);
  const assigneeUser = useUserData(assignee);

  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)} by{" "}
          {createdByUser.isSuccess ? createdByUser.data.name : ""}
        </small>
      </div>

      {assignee ? (
        <img
          className="assigned-to"
          alt={`${assigneeUser.isSuccess ? assigneeUser.data.name : ""}`}
          src={
            assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ""
          }
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
};
