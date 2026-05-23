'use client'

import { useState } from 'react'
import { Terminal, Copy, Save, Loader2 } from 'lucide-react'
import { analyzeLogWithGroq } from '@/lib/api/groq'
import { useNodeStore } from '@/lib/store'
import { AnalysisResult } from '@/lib/types'

export default function AnalyzerPage() {
  const [logInput, setLogInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const addAnalysis = useNodeStore((state) => state.addAnalysis)

  const handleAnalyze = async () => {
    if (!logInput.trim()) return

    setAnalyzing(true)
    try {
      const response = await analyzeLogWithGroq({ log: logInput })
      
      const analysis: AnalysisResult = {
        logInput,
        rootCause: response.rootCause,
        severity: response.severity,
        recommendedFix: response.recommendedFix,
        commands: response.commands,
        timestamp: new Date(),
      }

      setResult(analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = () => {
    if (result) {
      addAnalysis(result)
      alert('Analysis saved to history!')
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Log Analyzer</h1>
        <p className="text-slate-600 mt-2">Paste error log, get AI diagnosis</p>
      </header>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Terminal className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Paste Error Log</h2>
        </div>
        
        <textarea
          value={logInput}
          onChange={(e) => setLogInput(e.target.value)}
          placeholder="Paste your error log here..."
          className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical font-mono text-sm"
        />

        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !logInput.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze with MiMo</span>
            )}
          </button>
          
          <button
            onClick={() => setLogInput('')}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Analysis Result</h2>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
            >
              <Save className="w-4 h-4" />
              <span>Save to History</span>
            </button>
          </div>

          {/* Root Cause */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-slate-900">Root Cause</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                {result.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{result.rootCause}</p>
          </div>

          {/* Recommended Fix */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Recommended Fix</h3>
            <ol className="space-y-2">
              {result.recommendedFix.map((fix, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{fix}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Commands */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Commands</h3>
            <div className="space-y-3">
              {result.commands.map((command, index) => (
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
        </div>
      )}
    </div>
  )
}
