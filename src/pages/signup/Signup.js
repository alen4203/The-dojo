import { useState } from "react";
import { useSignup } from "../../hooks/useSignup.js";

// styles
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { signup, error, isPending } = useSignup();

  const handleFileChange = function (e) {
    setThumbnail(null);
    let selected = e.target.files[0];

    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError("Selected file size must be less than 100kb");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
    console.log("Thumbnail updated");
  };

  const handleSubmit = function (e) {
    e.preventDefault();

    signup(email, password, displayName, thumbnail);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <label>
        <span>Email:</span>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>DisplayName:</span>
        <input
          type="text"
          required
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>Thumbnail:</span>
        <input type="file" required onChange={handleFileChange} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Sign Up</button>}
      {isPending && (
        <button className="btn" disabled>
          Loading...
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
