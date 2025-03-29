// Import the Metadata type from Next.js for typing the metadata object
import type { Metadata } from "next";

// Import global CSS styles
import "./globals.css";

// Import CopilotKit React UI specific styles
import "@copilotkit/react-ui/styles.css";

// Import the CopilotKit component for AI integration
import { CopilotKit } from "@copilotkit/react-core";

// Define metadata for the application
export const metadata: Metadata = {
  // Set the page title
  title: "CopilotKit Crew Demo",
  // Set the page description for SEO and previews
  description: "Talk to your Crew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={` antialiased h-full`}>
        {/* CopilotKit wrapper for AI functionality */}
        <CopilotKit
          // Hide the development console in production
          showDevConsole={false}
          // Set the agent name from environment variables
          agent={process.env.NEXT_PUBLIC_AGENT_NAME}
          // Set the public API key from environment variables
          publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
