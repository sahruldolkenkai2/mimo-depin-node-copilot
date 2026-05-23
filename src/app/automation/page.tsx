'use client'

import { useState } from 'react'
import { Wrench, Copy, Download } from 'lucide-react'
import { generateAutomationConfig } from '@/lib/api/groq'

export default function AutomationPage() {
  const [nodeType, setNodeType] = useState('zcash')
  const [processManager, setProcessManager] = useState<'systemd' | 'pm2' | 'docker'>('systemd')
  const [nodeName, setNodeName] = useState('my-node')
  const [config, setConfig] = useState('')
  const [startupScript, setStartupScript] = useState('')
  const [generated, setGenerated] = useState(false)

  const nodeTypes = [
    { value: 'zcash', label: 'Zcash' },
    { value: 'filecoin', label: 'Filecoin' },
    { value: 'arweave', label: 'Arweave' },
    { value: 'other', label: 'Other' },
  ]

  const processManagers = [
    { value: 'systemd', label: 'systemd' },
    { value: 'pm2', label: 'PM2' },
    { value: 'docker', label: 'Docker' },
  ]

  const handleGenerate = async () => {
    if (!nodeName.trim()) {
      alert('Please enter a node name')
      return
    }

    try {
      const result = await generateAutomationConfig(nodeType, processManager, nodeName)
      setConfig(result.config)
      setStartupScript(result.startupScript)
      setGenerated(true)
    } catch (error) {
      console.error('Failed to generate config:', error)
      alert('Failed to generate configuration')
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFilename = () => {
    const extensions = {
      systemd: 'service',
      pm2: 'config.js',
      docker: 'docker-compose.yml',
    }
    return `${nodeName}.${extensions[processManager]}`
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Automation Generator</h1>
        <p className="text-slate-600 mt-2">Generate systemd/pm2/docker config for your nodes</p>
      </header>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Node Type
            </label>
            <select
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {nodeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Process Manager
            </label>
            <select
              value={processManager}
              onChange={(e) => setProcessManager(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {processManagers.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Node Name
            </label>
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="e.g., my-zcash-node"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center space-x-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Generate Config</span>
          </button>
        </div>
      </div>

      {/* Generated Config */}
      {generated && (
        <div className="space-y-6">
          {/* Config File */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Generated Config</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopy(config)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleDownload(config, getFilename())}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{config}</pre>
            </div>
          </div>

          {/* Startup Script */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Startup Script</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopy(startupScript)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => handleDownload(startupScript, `${nodeName}-startup.sh`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{startupScript}</pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Deployment Instructions</h3>
            <ol className="space-y-2 text-blue-800">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>Save the config file to your server</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>Save the startup script and make it executable: <code className="bg-blue-100 px-1 rounded">chmod +x startup.sh</code></span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>Run the startup script: <code className="bg-blue-100 px-1 rounded">./startup.sh</code></span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <span>Verify the service is running</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
