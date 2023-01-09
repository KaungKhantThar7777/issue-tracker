import { useState } from "react";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import { StatusSelect } from "../components/StatusSelect";
import { Link } from "react-router-dom";

export default function Issues() {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [status, setStatus] = useState("");

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList labels={selectedLabels} status={status} />
        </section>
        <aside>
          <LabelList
            selected={selectedLabels}
            toggle={(label) =>
              setSelectedLabels((currentLabels) =>
                currentLabels.includes(label)
                  ? currentLabels.filter(
                      (currentLabel) => currentLabel !== label
                    )
                  : currentLabels.concat(label)
              )
            }
          />
          <div>
            <h3>Status</h3>

            <StatusSelect
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            />
          </div>

          <Link to="/add">Add Issue</Link>
        </aside>
      </main>
    </div>
  );
}
