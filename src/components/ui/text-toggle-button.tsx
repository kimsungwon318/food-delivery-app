"use client";
import { useState } from "react";
import { Button } from "./button";

export default function TextToggleButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleChange = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <Button onClick={handleChange}>
      {isExpanded ? "表示を戻す" : "リスト表示"}
    </Button>
  );
}
