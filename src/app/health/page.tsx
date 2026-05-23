'use client'

import { useState } from 'react'
import { Activity, Copy, Loader2 } from 'lucide-react'
import { generateHealthChecklist } from '@/lib/api/groq'
import { useNodeStore } from '@/lib/store'

export default function HealthPage() {
  const [selectedNodeId, setSelectedNodeId] = useState('')
  const [checklist, setChecklist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [healthOutput, setHealthOutput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [healthScore, setHealthScore] = useState<number | null>(null)

  const nodes = useNodeStore((state) => state.nodes)

  const handleGenerateChecklist = async () => {
    const node = nodes.find((n) => n.id === selectedNodeId)
    setLoading(true)
    try {
      const checks = await generateHealthChecklist(node?.type)
      setChecklist(checks)
    } catch (error) {
      console.error('Failed to generate checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeHealth = async () => {
    setAnalyzing(true)
    try {
      // Mock health analysis
      const score = Math.floor(Math.random() * 40) + 60 // 60-100
      setHealthScore(score)
    } catch (error) {
      console.error('Failed to analyze health:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleCopyAll = () => {
    const allCommands = checklist.join('\n')
    navigator.clipboard.writeText(allCommands)
    alert('All commands copied!')
  }

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command)
    alert('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Health Checker</h1>
        <p className="text-slate-600 mt-2">Generate and run health checklist for your nodes</p>
      </header>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Node
            </label>
            <select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a node...</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.type})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateChecklist}
            disabled={loading || !selectedNodeId}
            className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Health Checklist</span>
            )}
          </button>
        </div>
      </div>

      {/* Checklist */}
      {checklist.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Health Checklist</h2>
            <button
              onClick={handleCopyAll}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <Copy className="w-4 h-4" />
              <span>Copy All</span>
            </button>
          </div>

          <div className="space-y-3">
            {checklist.map((command, index) => (
              <div key={index} className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm relative group">
                <code>{command}</code>
                <button
                  onClick={() => handleCopy(command)}
                  className="absolute top-2 right-2 p-2 bg-slate-700 rounded hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Output */}
      {checklist.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Paste Output</h2>
          
          <textarea
            value={healthOutput}
            onChange={(e) => setHealthOutput(e.target.value)}
            placeholder="Paste command output here..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical font-mono text-sm"
          />

          <button
            onClick={handleAnalyzeHealth}
            disabled={analyzing || !healthOutput.trim()}
            className="mt-4 px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Health</span>
            )}
          </button>
        </div>
      )}

      {/* Health Score */}
      {healthScore !== null && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Health Score</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-slate-900">{healthScore}/100</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                healthScore >= 80 ? 'bg-green-100 text-green-800' :
                healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthScore >= 80 ? 'Healthy' : healthScore >= 60 ? 'Warning' : 'Critical'}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  healthScore >= 80 ? 'bg-green-500' :
                  healthScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* Health Checks */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600">✓</span>
              <span className="text-slate-700">CPU: Normal</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600">✓</span>
              <span className="text-slate-700">Memory: Normal</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600">⚠</span>
              <span className="text-slate-700">Disk: 85% used</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600">✓</span>
              <span className="text-slate-700">Network: Connected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
