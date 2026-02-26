export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            React + Tailwind + Rsbuild
          </h1>
          <p className="text-gray-600 text-center mb-6">
            项目已成功搭建！
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="font-semibold text-blue-800 mb-2">技术栈</h2>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• React 18</li>
                <li>• Tailwind CSS</li>
                <li>• Rsbuild</li>
              </ul>
            </div>
          </div>
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            开始开发
          </button>
        </div>
      </div>
    </div>
  );
}
