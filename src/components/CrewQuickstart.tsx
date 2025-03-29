"use client";

import {
  CrewsAgentState,
  CrewsResponseStatus,
  CrewsStateItem,
  useCoAgent,
  useCoAgentStateRender,
  useCopilotAction,
  useCopilotChat,
  useCopilotAdditionalInstructions,
} from "@copilotkit/react-core";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import CrewStateRenderer from "./CrewStateRenderer";
import { CrewHumanFeedbackRenderer } from "./CrewHumanFeedbackRenderer";

import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import Chat from "./Chat";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import { useWindowSize } from "@/hooks/useWindowSize";

/**
 * useCrewQuickstart
 * Minimal example that:
 * 1) Sets up a crew/agent
 * 2) Handles text-based user input (get_input)
 * 3) Renders real-time crew state
 * 4) Handles "crew_requesting_feedback"
 */
interface CrewsFeedback extends CrewsStateItem {
  /**
   * Output of the task execution
   */
  task_output?: string;
}

interface CrewQuickstartProps {
  crewName: string;
  inputs: Array<string>;
}

export const CrewQuickstart: React.FC<CrewQuickstartProps> = ({
  crewName,
  inputs,
}: {
  crewName: string;
  inputs: Array<string>;
}) => {
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const { isMobile } = useWindowSize();
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  useEffect(() => {
    setDirection(isMobile ? "vertical" : "horizontal");
  }, [isMobile]);

  const { state, setState, run } = useCoAgent<
    CrewsAgentState & {
      result: string;
      inputs: Record<string, string>;
    }
  >({
    name: crewName,
    initialState: {
      inputs: {},
      result: "Crew result will appear here...",
    },
  });

  const { appendMessage, isLoading } = useCopilotChat();

  const instructions =
    "INPUTS ARE ABSOLUTELY REQUIRED. Please call getInputs before proceeding with anything else.";

  // Render an initial message when the chat is first loaded
  useEffect(() => {
    if (initialMessageSent || isLoading) return;

    setTimeout(async () => {
      await appendMessage(
        new TextMessage({
          content: "Hi, Please provide your inputs before we get started.",
          role: MessageRole.Developer,
        })
      );
      setInitialMessageSent(true);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialMessageSent && Object.values(state?.inputs || {}).length > 0) {
      appendMessage(
        new TextMessage({
          role: MessageRole.Developer,
          content: "My inputs are: " + JSON.stringify(state?.inputs),
        })
      ).then(() => {
        setInitialMessageSent(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessageSent, state?.inputs]);

  useCopilotAdditionalInstructions({
    instructions,
    available:
      Object.values(state?.inputs || {}).length > 0 ? "enabled" : "disabled",
  });

  useCopilotAction({
    name: "getInputs",
    followUp: false,
    description:
      "This action allows Crew to get required inputs from the user before starting the Crew.",
    renderAndWaitForResponse({ status }) {
      if (status === "inProgress" || status === "executing") {
        return (
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem(
                "input"
              ) as HTMLTextAreaElement;
              const inputValue = input.value;
              const inputKey = input.id;

              setState({
                ...state,
                inputs: {
                  ...state.inputs,
                  [inputKey]: inputValue,
                },
              });
              setTimeout(async () => {
                console.log("running crew");
                await run();
                console.log("crew run complete");
              }, 0);
            }}>
            <div className="flex flex-col gap-4">
              {inputs.map((input) => (
                <div key={input} className="flex flex-col gap-2">
                  <textarea
                    id={input}
                    autoFocus
                    name="input"
                    placeholder={`Enter ${input} here`}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                Submit
              </button>
            </div>
          </form>
        );
      }
      return <>Inputs submitted</>;
    },
  });

  useCoAgentStateRender({
    name: crewName,
    render: ({ state, status }) => (
      <CrewStateRenderer state={state} status={status} />
    ),
  });

  useCopilotAction({
    name: "crew_requesting_feedback",
    description: "Request feedback from the user",
    renderAndWaitForResponse(props) {
      const { status, args, respond } = props;
      return (
        <CrewHumanFeedbackRenderer
          feedback={args as unknown as CrewsFeedback}
          respond={respond}
          status={status as CrewsResponseStatus}
        />
      );
    },
  });

  const agentName = crewName.replace(/[^a-zA-Z0-9]/g, " ");

  return (
    <div className="w-full h-full relative">
      <ResizablePanelGroup direction={direction} className="w-full h-full">
        <ResizablePanel defaultSize={60} minSize={30}>
          <Chat />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {agentName}
                </h1>
              </div>

              <div className="h-full">
                <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 h-full overflow-y-auto prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{state?.result || ""}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
