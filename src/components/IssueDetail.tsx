// IssueDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Issue {
  id: string;
  name: string;
  description: string;
  resolved: boolean;
  address: string;
  markedForReview?: boolean;
  image?: string;
}

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`https://api.example.com/issues/${id}`)
        .then((response) => response.json())
        .then((data: Issue) => setIssue(data))
        .catch((error) => console.error("Error fetching issue:", error));
    }
  }, [id]);

  if (!issue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">
        Back
      </button>
      <h1 className="text-3xl font-bold mb-4">{issue.name}</h1>
      {issue.image && (
        <img
          src={issue.image}
          alt={issue.name}
          className="w-full max-h-96 object-cover rounded mb-4"
        />
      )}
      <p className="text-lg mb-2">{issue.description}</p>
      <p className="text-md text-gray-600 mb-2">Address: {issue.address}</p>
      <p className="text-md text-gray-600">
        Status: {issue.resolved ? "Resolved" : "Not Resolved"}
      </p>
      {issue.markedForReview && (
        <p className="text-md text-yellow-600 mt-2">Marked for Review</p>
      )}
    </div>
  );
};

export default IssueDetail;
