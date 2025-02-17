"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

export default function MicButton ( {toggleListening, isListening} ) {
    
  return (
    <Button
      onClick={() => toggleListening()}
      className={clsx(
        "relative inline-flex justify-center items-center text-white text-3xl border-none rounded-full cursor-pointer transition-colors duration-300",
        isListening ? "bg-[#1F2937] w-24 h-24 animate-pulse" : "bg-[#27e5f3] w-20 h-20",
        isListening && "listening"
      )}
    >
      {isListening ? <Mic className="h-10 w-10" /> : <MicOff className="h-8 w-8" />}
    </Button>
  );
};

