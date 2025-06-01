import { useState } from 'react'

const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID
const configId = process.env.NEXT_PUBLIC_RETELL_CONFIG_ID
const apiKey = process.env.NEXT_PUBLIC_RETELL_API_KEY

export default function RetellChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[200] bg-primary text-white rounded-full shadow-lg p-4 hover:bg-primary/90 focus:outline-none"
        aria-label="Open chat"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor"/><path d="M7 10h10M7 14h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-[201] flex items-end justify-end bg-black/30">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-6 p-4 relative flex flex-col" style={{height: '70vh'}}>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 p-2 rounded hover:bg-muted"
              aria-label="Close chat"
            >
              <span style={{fontSize: 24}}>&times;</span>
            </button>
            <h2 className="text-lg font-bold mb-2">Chat with Auro Assistant</h2>
            {/* Retell agent chat integration placeholder */}
            <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50 text-center flex flex-col items-center justify-center">
              {agentId && configId && apiKey ? (
                <>
                  {/* TODO: Insert your Retell chat widget/component here, using the env variables below */}
                  <div className="mb-2 text-xs text-gray-400">Agent ID: {agentId}<br/>Config ID: {configId}</div>
                  <span className="text-gray-400">Retell agent chat goes here</span>
                </>
              ) : (
                <span className="text-red-500">Retell agent environment variables are missing.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 