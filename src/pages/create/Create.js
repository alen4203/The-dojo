import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useCollection } from "../../hooks/useCollection.js";
import { timestamp } from "../../firebase/config.js";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useFirestore } from "../../hooks/useFirestore.js";

// styles
import "./Create.css";

// <option value=...>label</option>
const categories = [
  { value: "development", label: "Development" },
  { value: "sales", label: "Sales" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);
  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("projects");
  const navigate = useNavigate();

  // form field values
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!documents) return;
    const options = documents.map((user) => {
      return { value: user, label: user.displayName };
    });
    setUsers(options);
  }, [documents]);

  const handleSubmit = async function (e) {
    e.preventDefault();

    setFormError(null);
    if (!category) {
      setFormError("Please select a project category.");
      return;
    }

    if (assignedUsers.length === 0) {
      setFormError("Please assign this project to at least one user.");
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });

    const project = {
      name,
      details,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      category: category.value,
      createdBy,
      assignedUsersList,
      comments: [],
    };

    await addDocument(project);
    if (!response.error) navigate("/");
  };

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project Name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>
        <label>
          <span>Project Due Date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project Category:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign To:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        <button className="btn">Create Project</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
