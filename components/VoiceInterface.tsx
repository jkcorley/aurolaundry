"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInterfaceProps {
  apiKey: string;
  agentId: string;
  conversationFlowId?: string;
}

export function VoiceInterface({ apiKey, agentId, conversationFlowId }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Retell client here once you have access to the SDK
    // Use conversationFlowId if needed
    // This is a placeholder for the actual implementation
    return () => {
      // Cleanup
    };
  }, [apiKey, agentId, conversationFlowId]);

  const toggleListening = async () => {
    if (!isListening) {
      try {
        // Start listening and connect to Retell agent
        setIsListening(true);
        // Implementation will go here
      } catch (error) {
        console.error("Failed to start listening:", error);
        setIsListening(false);
      }
    } else {
      // Stop listening
      setIsListening(false);
      // Implementation will go here
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4">
      <div className="bg-background rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Voice Assistant</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={toggleListening}
            className="rounded-full w-16 h-16"
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
} 