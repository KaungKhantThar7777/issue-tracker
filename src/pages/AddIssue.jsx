import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addIssue = useMutation(
    (issueBody) => {
      return fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json());
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.setQueryData(["issues", data.number.toString()], data);
        queryClient.invalidateQueries(["issues"], { exact: true });
        navigate(`/issue/${data.number}`);
      },
    }
  );
  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          addIssue.mutate({
            comment: e.target.comment.value,
            title: e.target.title.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input id="title" placeholder="Title" name="title" />

        <label htmlFor="comment">Comment</label>
        <textarea id="comment" placeholder="Comment" name="comment" />

        <button>Add Issue</button>
      </form>
    </div>
  );
}
