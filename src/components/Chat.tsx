"use client";

import React from "react";
import { CopilotKitCSSProperties, CopilotChat } from "@copilotkit/react-ui";

function Chat() {
  return (
    <div
      className="h-full relative overflow-y-auto"
      style={
        {
          "--copilot-kit-primary-color": "#4F4F4F",
        } as CopilotKitCSSProperties
      }>
      <CopilotChat
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Your Assistant",
          initial:
            "Hi! 👋 Please provide the location you want to find a restaurant before we get started.",
        }}
        className="h-full flex flex-col"
        icons={{
          spinnerIcon: (
            <span className="h-5 w-5 text-gray-500 animate-pulse">...</span>
          ),
        }}
      />
    </div>
  );
}

export default Chat;
