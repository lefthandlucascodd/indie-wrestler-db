export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-red-950 to-black py-20 border-b-4 border-yellow-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRzNCgyIDQgNHYxMmMwIDItMiA0LTQgNHMtNC0yLTQtNFYzNHptMCAwYzAtMiAyLTQgNC00czQgMiA0IDR2MTJjMCAyLTIgNC00IDRzLTQtMi00LTRWMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider animate-pulse">
                🔴 Live Rankings
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">THE ULTIMATE</span>
              <br />
              <span className="text-gradient-gold">INDIE WRESTLING</span>
              <br />
              <span className="text-red-600">POWER RANKINGS</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-semibold">
              Real-time rankings powered by social media dominance, fan engagement, and industry buzz
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 px-6 py-3 rounded-lg">
                <div className="text-yellow-500 font-bold text-2xl">1000+</div>
                <div className="text-gray-400 uppercase text-xs">Wrestlers Tracked</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 px-6 py-3 rounded-lg">
                <div className="text-yellow-500 font-bold text-2xl">Daily</div>
                <div className="text-gray-400 uppercase text-xs">Updates</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 px-6 py-3 rounded-lg">
                <div className="text-yellow-500 font-bold text-2xl">4</div>
                <div className="text-gray-400 uppercase text-xs">Data Sources</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-8 shadow-2xl border-4 border-yellow-500 transform hover:scale-[1.02] transition-transform">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🏆</div>
              <div>
                <h3 className="text-3xl font-black text-white mb-3 uppercase">
                  Database Loading...
                </h3>
                <p className="text-white/90 text-lg font-semibold mb-4">
                  We're currently compiling the most comprehensive independent wrestling database ever created.
                  Rankings, stats, and social dominance scores coming soon!
                </p>
                <div className="flex gap-2">
                  <div className="h-2 w-32 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-white font-bold text-sm">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-black text-center mb-12 text-white uppercase">
            How We <span className="text-yellow-500">Rank</span> The Best
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Data Sources Card */}
            <div className="group bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 hover:border-yellow-500 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 card-shine">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-yellow-500 font-bold text-xl mb-3 uppercase">Multi-Platform Tracking</h4>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">▸</span> Twitter follower counts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-400">▸</span> Instagram engagement
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-400">▸</span> Reddit buzz tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">▸</span> Podcast mentions
                </li>
              </ul>
            </div>

            {/* Algorithm Card */}
            <div className="group bg-gradient-to-br from-red-950 to-black border-2 border-gray-800 hover:border-red-600 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 card-shine">
              <div className="text-4xl mb-4">🔥</div>
              <h4 className="text-red-500 font-bold text-xl mb-3 uppercase">Smart Algorithm</h4>
              <div className="text-gray-300 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Twitter Impact</span>
                  <span className="text-yellow-500 font-bold">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Instagram Impact</span>
                  <span className="text-yellow-500 font-bold">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reddit Buzz</span>
                  <span className="text-yellow-500 font-bold">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Podcast Mentions</span>
                  <span className="text-yellow-500 font-bold">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>YouTube</span>
                  <span className="text-yellow-500 font-bold">10%</span>
                </div>
              </div>
            </div>

            {/* Updates Card */}
            <div className="group bg-gradient-to-br from-blue-950 to-black border-2 border-gray-800 hover:border-blue-600 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 card-shine">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-blue-500 font-bold text-xl mb-3 uppercase">Real-Time Updates</h4>
              <div className="text-gray-300 space-y-3">
                <p>Rankings automatically refresh every 24 hours with the latest data from all platforms.</p>
                <div className="bg-black/50 border border-blue-500/30 rounded-lg p-3 mt-4">
                  <div className="text-blue-400 text-xs uppercase font-bold mb-1">Next Update</div>
                  <div className="text-white font-bold text-lg">2:00 AM EST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-2xl p-12 text-center shadow-2xl border-4 border-red-500">
          <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase">
            Want Your Favorite Wrestler Listed?
          </h3>
          <p className="text-xl text-white/90 mb-6">
            Submit wrestler profiles and help us build the most comprehensive indie wrestling database!
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg px-8 py-4 rounded-lg uppercase tracking-wide transform hover:scale-105 transition-all shadow-lg">
            Coming Soon
          </button>
        </div>
      </section>
    </>
  )
}
