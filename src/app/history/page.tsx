'use client'

import { useState } from 'react'
import { History, Search, Download, Filter } from 'lucide-react'
import { useNodeStore } from '@/lib/store'
import { AnalysisResult } from '@/lib/types'

export default function HistoryPage() {
  const analyses = useNodeStore((state) => state.analyses)
  const nodes = useNodeStore((state) => state.nodes)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [nodeFilter, setNodeFilter] = useState('all')

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getSeverityIcon = (severity: string) => {
    const icons = {
      critical: '✗',
      high: '⚠',
      medium: '⚠',
      low: '✓',
    }
    return icons[severity as keyof typeof icons] || '•'
  }

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = 
      analysis.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.logInput.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSeverity = severityFilter === 'all' || analysis.severity === severityFilter
    const matchesNode = nodeFilter === 'all' || analysis.nodeId === nodeFilter

    return matchesSearch && matchesSeverity && matchesNode
  })

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredAnalyses, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Severity', 'Root Cause', 'Commands']
    const rows = filteredAnalyses.map((a) => [
      new Date(a.timestamp).toLocaleString(),
      a.severity,
      a.rootCause,
      a.commands.join('; '),
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-history-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">History</h1>
        <p className="text-slate-600 mt-2">View all analysis history</p>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by error..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Node
            </label>
            <select
              value={nodeFilter}
              onChange={(e) => setNodeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Nodes</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleExportJSON}
            disabled={filteredAnalyses.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredAnalyses.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <History className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
          <span className="text-sm text-slate-500">({filteredAnalyses.length} results)</span>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No analysis history yet</p>
            <p className="text-sm text-slate-400 mt-2">Start analyzing logs to see history here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSeverityIcon(analysis.severity)}</span>
                    <div>
                      <p className="text-sm text-slate-500">{formatDate(analysis.timestamp)}</p>
                      {analysis.nodeId && (
                        <p className="text-xs text-slate-400">
                          Node: {nodes.find((n) => n.id === analysis.nodeId)?.name || 'Unknown'}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(analysis.severity)}`}>
                    {analysis.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-slate-900 font-medium mb-2">{analysis.rootCause}</p>

                <div className="mb-3">
                  <p className="text-sm text-slate-600 mb-1">Fix:</p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {analysis.recommendedFix.slice(0, 2).map((fix, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-slate-400">•</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysis.commands.map((cmd, i) => (
                    <code key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {cmd.length > 50 ? cmd.substring(0, 50) + '...' : cmd}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
