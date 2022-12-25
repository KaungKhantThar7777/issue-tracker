import { Link } from "react-router-dom";
import { GoComment, GoIssueClosed, GoIssueOpened } from "react-icons/go";

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
            <span key={label}>{label}</span>
          ))}
        </span>
        <small>
          #{number} opened {createdDate} by {createdBy}
        </small>
      </div>

      {assignee ? <div>{assignee}</div> : null}
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
