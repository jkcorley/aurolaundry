import Image from 'next/image'
import { ChatDashModal } from '../components/ChatDashModal'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <Image src="/logo-horizontal.png" alt="Auro Logo" width={240} height={100} className="mb-8 w-full max-w-xs" />
      <h1 className="text-4xl font-bold mb-4 text-blue-700 text-center">Welcome to Auro</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        Auro is your modern laundry management and monitoring platform. Effortlessly track, manage, and optimize your laundry experience—whether you're a customer, laundromat owner, or service provider. Enjoy features like real-time machine status, booking, supply orders, and our new AI voice assistant for hands-free help!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
        <div className="flex flex-col items-center w-full">
          <Image src="/laundry1.jpg" alt="Laundry 1" width={300} height={200} className="rounded-lg shadow-md mb-2 w-full max-w-xs" />
          <span className="text-sm text-gray-500 text-center">Easy laundry, happy results</span>
        </div>
        <div className="flex flex-col items-center w-full">
          <Image src="/laundry2.webp" alt="Laundry 2" width={300} height={200} className="rounded-lg shadow-md mb-2 w-full max-w-xs" />
          <span className="text-sm text-gray-500 text-center">Enjoy the freshness</span>
        </div>
        <div className="flex flex-col items-center w-full">
          <Image src="/laundry3.webp" alt="Laundry 3" width={300} height={200} className="rounded-lg shadow-md mb-2 w-full max-w-xs" />
          <span className="text-sm text-gray-500 text-center">Modern, efficient machines</span>
        </div>
      </div>
      <ChatDashModal />
    </div>
  )
}
