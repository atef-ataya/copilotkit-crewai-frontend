"use client";

import { CrewsResponseStatus, CrewsStateItem } from "@copilotkit/react-core";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface CrewsFeedback extends CrewsStateItem {
  /**
   * Output of the task execution
   */
  task_output?: string;
}

/**
 * Renders a simple UI for agent-requested user feedback (Approve / Reject).
 */
function CrewHumanFeedbackRenderer({
  feedback,
  respond,
  status,
}: {
  feedback: CrewsFeedback;
  respond?: (input: string) => void;
  status: CrewsResponseStatus;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userResponse, setUserResponse] = useState<string | null>(null);

  if (status === "complete") {
    return (
      <div style={{ marginTop: 8, textAlign: "right" }}>
        {userResponse || "Feedback submitted."}
      </div>
    );
  }

  if (status === "inProgress" || status === "executing") {
    return (
      <div style={{ marginTop: 8 }}>
        {isExpanded && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white prose dark:prose-invert max-w-none dark:bg-gray-800 dark:border-gray-700 shadow-sm">
            <ReactMarkdown>{feedback.task_output || ""}</ReactMarkdown>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Hide" : "Show"} Feedback
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            onClick={() => {
              setUserResponse("Approved");
              respond?.("Approve");
            }}>
            Approve
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            onClick={() => {
              setUserResponse("Rejected");
              respond?.("Reject");
            }}>
            Reject
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export { CrewHumanFeedbackRenderer };
