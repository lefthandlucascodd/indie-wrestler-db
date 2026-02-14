export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Independent Wrestler Rankings
        </h2>
        <p className="text-gray-600">
          Rankings powered by social media followers, Reddit mentions, and podcast appearances
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-bold mb-2">Coming Soon</h3>
        <p className="text-sm text-gray-700">
          This database is currently being populated. Check back soon to see rankings of
          your favorite independent wrestlers!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-bold mb-2">📊 Data Sources</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Twitter followers</li>
            <li>Instagram followers</li>
            <li>Reddit mentions</li>
            <li>Podcast appearances</li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-bold mb-2">🔄 Updates</h4>
          <p className="text-sm text-gray-700">
            Rankings are automatically updated daily with the latest social media metrics
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-bold mb-2">🎯 Focus</h4>
          <p className="text-sm text-gray-700">
            Only tracks independent wrestlers not signed to major promotions
          </p>
        </div>
      </div>
    </div>
  )
}
