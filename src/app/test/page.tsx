export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Tailwind Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Card 1</h2>
            <p className="text-gray-600">This is a test card with basic Tailwind classes.</p>
          </div>
          
          <div className="bg-green-100 p-6 rounded-lg shadow-md border border-green-300">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Card 2</h2>
            <p className="text-green-700">This card uses green colors to test Tailwind.</p>
          </div>
          
          <div className="bg-orange-100 p-6 rounded-lg shadow-md border border-orange-300">
            <h2 className="text-xl font-semibold text-orange-800 mb-3">Card 3</h2>
            <p className="text-orange-700">This card uses orange colors to test Tailwind.</p>
          </div>
        </div>
        
        <div className="mt-8 bg-red-100 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-red-800 mb-4">Color Test</h3>
          <div className="space-y-2">
            <div className="bg-blue-500 text-white p-2 rounded">Blue Background</div>
            <div className="bg-green-500 text-white p-2 rounded">Green Background</div>
            <div className="bg-yellow-500 text-white p-2 rounded">Yellow Background</div>
            <div className="bg-red-500 text-white p-2 rounded">Red Background</div>
            <div className="bg-purple-500 text-white p-2 rounded">Purple Background</div>
          </div>
        </div>
      </div>
    </div>
  );
}
