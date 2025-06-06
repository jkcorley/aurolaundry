"use client";

import { useState } from "react";
import { Mic, X } from "lucide-react";

export function ChatDashModal() {
  const [open, setOpen] = useState(false); // Modal closed by default
  const agentId = "68437824c53e52182787d572";

  return (
    <>
      {/* Mic Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: 'none',
          zIndex: 99999,
          padding: 0
        }}
        aria-label="Open chat assistant"
      >
        <Mic style={{ width: '28px', height: '28px', color: 'white' }} />
      </button>

      {/* Modal */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '90vw',
              height: '90vh',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Auro Assistant</h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
                aria-label="Close chat assistant"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <iframe
                src={`https://agency-usxptf.chat-dash.com/prototype/${agentId}`}
                title="ChatDash Assistant"
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '12px', width: '100%', height: '100%' }}
                allow="microphone; camera"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
