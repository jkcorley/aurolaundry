"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";
import Image from "next/image";

export function ChatDashModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed z-50 rounded-full w-16 h-16 shadow-xl flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 bottom-[84px] right-6 md:bottom-6 md:right-8"
          aria-label="Open chat assistant"
        >
          <Mic className="w-7 h-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full rounded-2xl shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-blue-100 to-white px-6 py-4 flex items-center gap-3 border-b">
          <Image src="/logo-horizontal.png" alt="Auro Logo" width={32} height={32} />
          <DialogTitle className="text-lg font-bold">Auro Assistant</DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-background p-4 overflow-y-auto flex flex-col">
          <iframe
            src="https://agency-9e064f.chat-dash.com/prototype/683a99083ca574b13da8970f"
            title="ChatDash Assistant"
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "60vh", borderRadius: 12 }}
            allow="microphone; camera"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 