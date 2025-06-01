"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";

export function VoiceChatModal({ agentId, conversationFlowId }: { agentId: string; conversationFlowId: string }) {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  const startCall = async () => {
    setConnecting(true);
    setError(null);
    setConnected(false);
    try {
      const res = await fetch("/api/retell/start-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, conversationFlowId }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionData(data.data);
        setConnected(true);
      } else {
        setError(data.error || "Failed to start session");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-lg flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
            size="icon"
            aria-label="Open Voice Assistant"
          >
            <Mic className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Voice Assistant
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 items-center py-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : connecting ? "bg-yellow-400 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-muted-foreground">
                {connected ? "Connected" : connecting ? "Connecting..." : "Disconnected"}
              </span>
            </div>
            <Button onClick={startCall} disabled={connecting || connected} className="w-full">
              {connecting ? "Connecting..." : connected ? "Session Started" : "Start Call"}
            </Button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {/* Future: Chat log, audio controls, etc. */}
            {connected && (
              <div className="text-green-600 text-sm mt-2">Session started! (ID: {sessionData?.id || "-"})</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 