import YieldFlowTracker from '@/components/dashboard/YieldFlowTracker';
import SecurityHealthMap from '@/components/dashboard/SecurityHealthMap';
import DeploymentStatusTracker from '@/components/dashboard/DeploymentStatusTracker';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                🌌 Omni-Dashboard (OmniMap)
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ScrollVerse Real-Time Operational Intelligence | Omnitech1™
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Sovereign System</p>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Chais Hill | Creator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Yield Flow Tracker Section */}
          <section>
            <YieldFlowTracker />
          </section>

          {/* Security Health Map Section */}
          <section>
            <SecurityHealthMap />
          </section>

          {/* Deployment Status Tracker Section */}
          <section>
            <DeploymentStatusTracker />
          </section>

          {/* Footer Info */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                🔒 ScrollVerse Data Integrity Chain (SDIC)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                All operational data is automatically time-stamped and hashed into a tamper-proof ledger 
                using the SDIC_TimeLock smart contract. This ensures complete data redundancy, security, 
                and auditability across all 50 compounds in the ScrollVerse ecosystem.
              </p>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <span>✓ Hyper-Secure Proof of Time</span>
                <span>✓ ScrollVerse Protocol Compatible</span>
                <span>✓ Real-Time Data Integrity</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 Omnitech1™ | ScrollVerse Infinity Loop</p>
            <p className="mt-1">Sovereign Architecture by Chais Kenyatta Hill</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
