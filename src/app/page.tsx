import { Terminal, Activity, Wrench, History, PlusCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const stats = [
    { label: 'Total Nodes', value: '0', icon: Activity },
    { label: 'Healthy', value: '0', icon: Activity },
    { label: 'Recent Errors', value: '0', icon: AlertTriangle },
  ]

  const quickActions = [
    { title: 'Analyze Log', description: 'Paste error log, get AI diagnosis', icon: Terminal, href: '/analyzer' },
    { title: 'Health Check', description: 'Generate health checklist', icon: Activity, href: '/health' },
    { title: 'Automation', description: 'Generate systemd/pm2/docker config', icon: Wrench, href: '/automation' },
    { title: 'History', description: 'View analysis history', icon: History, href: '/history' },
    { title: 'Add Node', description: 'Register new node', icon: PlusCircle, href: '/nodes' },
  ]

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">MiMo DePIN Node Copilot</h1>
        <p className="text-slate-600 mt-2">AI assistant untuk install, debug, dan monitor DePIN nodes</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-primary-500" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{action.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Nodes (Empty State) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Nodes</h2>
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No nodes registered yet</p>
          <Link
            href="/nodes"
            className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Your First Node
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Powered by Groq (Llama 3.3 70B) + MiMo API • Free tier 30 RPM
        </p>
      </footer>
    </div>
  )
}
