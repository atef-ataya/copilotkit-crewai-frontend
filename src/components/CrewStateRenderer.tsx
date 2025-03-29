"use client";

import {
  CrewsAgentState,
  CrewsResponseStatus,
  CrewsTaskStateItem,
  CrewsToolStateItem,
} from "@copilotkit/react-core";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * Renders your Crew's steps & tasks in real-time.
 */
function CrewStateRenderer({
  state,
  status,
}: {
  state: CrewsAgentState;
  status: CrewsResponseStatus;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevItemsLengthRef = useRef<number>(0);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Combine steps + tasks
  const items = useMemo(() => {
    if (!state) return [];
    return [...(state.steps || []), ...(state.tasks || [])].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [state]);

  // Highlight newly added item & auto-scroll
  useEffect(() => {
    if (!state) return;
    if (items.length > prevItemsLengthRef.current) {
      const newestItem = items[items.length - 1];
      setHighlightId(newestItem.id);
      setTimeout(() => setHighlightId(null), 1500);

      if (contentRef.current && !isCollapsed) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }
    prevItemsLengthRef.current = items.length;
  }, [items, isCollapsed, state]);

  if (!state) {
    return <div>Loading crew state...</div>;
  }

  // Hide entirely if collapsed & empty & not in progress
  if (isCollapsed && items.length === 0 && status !== "inProgress") return null;

  return (
    <div className="mt-2 text-sm">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}>
        <span className="mr-1">{isCollapsed ? "▶" : "▼"}</span>
        <span className="text-gray-700">
          {status === "inProgress" ? "Crew is analyzing..." : "Crew analysis"}
        </span>
      </div>

      {!isCollapsed && (
        <div
          ref={contentRef}
          className="max-h-[200px] overflow-auto border-l border-gray-200 pl-2 ml-1 mt-1">
          {items.length > 0 ? (
            items.map((item) => {
              const isTool = (item as CrewsToolStateItem).tool !== undefined;
              const isHighlighted = item.id === highlightId;
              return (
                <div
                  key={item.id}
                  className={`mb-2 ${isHighlighted ? "animate-fadeIn" : ""}`}>
                  <div className="font-bold text-gray-800 dark:text-gray-200">
                    {isTool
                      ? (item as CrewsToolStateItem).tool
                      : (item as CrewsTaskStateItem).name}
                  </div>
                  {"thought" in item && item.thought && (
                    <div className="mt-1 opacity-80 text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none">
                      <span className="font-medium">Thought:</span>{" "}
                      <ReactMarkdown>{item.thought}</ReactMarkdown>
                    </div>
                  )}
                  {"result" in item && item.result !== undefined && (
                    <pre className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
                      {JSON.stringify(item.result, null, 2)}
                    </pre>
                  )}
                  {"description" in item && item.description && (
                    <div className="mt-1 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{item.description}</ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="opacity-70 text-gray-500">No activity yet...</div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s;
        }
      `}</style>
    </div>
  );
}

export default CrewStateRenderer;
