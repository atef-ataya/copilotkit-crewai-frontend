"use client";

import React from "react";
import { CrewQuickstart } from "@/components/CrewQuickstart";

export default function Home() {
  return (
    <div className="w-full h-full relative">
      <CrewQuickstart crewName="restaurant_finder" inputs={["location"]} />
    </div>
  );
}
