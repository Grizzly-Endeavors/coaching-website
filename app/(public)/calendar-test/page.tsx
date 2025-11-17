'use client';

export default function CalendarTestPage() {
  // You can paste your calendar URL here for testing
  const testCalendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL || '';

  return (
    <div className="min-h-screen bg-[#0f0f23] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-4">
              Google Calendar Embed Test
            </h1>
            <p className="text-gray-400">
              This page lets you preview the calendar embed styling
            </p>
          </div>

          {/* Color reference */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0f0f23] border border-gray-700 p-4 rounded">
              <div className="text-xs text-gray-400 mb-1">BG Primary</div>
              <div className="text-sm font-mono text-gray-300">#0f0f23</div>
            </div>
            <div className="bg-[#1a1a2e] border border-gray-700 p-4 rounded">
              <div className="text-xs text-gray-400 mb-1">BG Surface</div>
              <div className="text-sm font-mono text-gray-300">#1a1a2e</div>
            </div>
            <div className="bg-[#2a2a40] border border-gray-700 p-4 rounded">
              <div className="text-xs text-gray-400 mb-1">BG Elevated</div>
              <div className="text-sm font-mono text-gray-300">#2a2a40</div>
            </div>
            <div className="bg-[#9333ea] border border-gray-700 p-4 rounded">
              <div className="text-xs text-gray-400 mb-1">Purple</div>
              <div className="text-sm font-mono text-gray-300">#9333ea</div>
            </div>
          </div>

          {testCalendarUrl ? (
            <>
              {/* Version 1: Current approach with URL params */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Version 1: URL Parameters
                </h2>
                <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
                  <div className="w-full" style={{ height: '800px' }}>
                    <iframe
                      src={(() => {
                        const baseUrl = testCalendarUrl;
                        const separator = baseUrl.includes('?') ? '&' : '?';
                        const params = [
                          'bgcolor=%230f0f23',
                          'color=%239333ea',
                          'showTitle=0',
                          'showNav=1',
                          'showPrint=0',
                          'showTabs=0',
                          'showCalendars=0',
                          'showTz=0',
                          'mode=WEEK',
                        ].join('&');
                        return `${baseUrl}${separator}${params}`;
                      })()}
                      className="w-full h-full border-0 rounded-lg"
                      style={{ colorScheme: 'dark' }}
                      title="Calendar Test - URL Params"
                    />
                  </div>
                </div>
              </div>

              {/* Version 2: Alternative with different params */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Version 2: Alternative Parameters
                </h2>
                <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
                  <div className="w-full" style={{ height: '800px' }}>
                    <iframe
                      src={(() => {
                        const baseUrl = testCalendarUrl;
                        const separator = baseUrl.includes('?') ? '&' : '?';
                        const params = [
                          'bgcolor=%231a1a2e',
                          'color=%238b5cf6',
                          'showTitle=0',
                          'showNav=1',
                          'showPrint=0',
                          'showTabs=0',
                          'showCalendars=0',
                          'mode=AGENDA',
                        ].join('&');
                        return `${baseUrl}${separator}${params}`;
                      })()}
                      className="w-full h-full border-0 rounded-lg"
                      style={{ colorScheme: 'dark' }}
                      title="Calendar Test - Alternative"
                    />
                  </div>
                </div>
              </div>

              {/* Version 3: With wrapper styling */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Version 3: With CSS Filter (Dark Mode Hack)
                </h2>
                <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
                  <div
                    className="w-full rounded-lg overflow-hidden"
                    style={{
                      height: '800px',
                      filter: 'invert(0.9) hue-rotate(180deg)',
                    }}
                  >
                    <iframe
                      src={testCalendarUrl}
                      className="w-full h-full border-0"
                      style={{
                        colorScheme: 'dark',
                        filter: 'invert(0.9) hue-rotate(180deg)',
                      }}
                      title="Calendar Test - CSS Filter"
                    />
                  </div>
                </div>
              </div>

              {/* Version 4: Plain/Original */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  Version 4: Original (No Styling)
                </h2>
                <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
                  <div className="w-full" style={{ height: '800px' }}>
                    <iframe
                      src={testCalendarUrl}
                      className="w-full h-full border-0 rounded-lg"
                      title="Calendar Test - Original"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#1a1a2e] border-2 border-dashed border-purple-600/30 rounded-lg p-12 text-center">
              <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-100 mb-2">No Calendar URL Configured</h3>
              <p className="text-gray-400 mb-4">
                Set NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL in your .env.local file
              </p>
              <p className="text-sm text-purple-400 font-mono bg-purple-600/10 px-4 py-2 rounded inline-block">
                NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL=your_calendar_url
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
