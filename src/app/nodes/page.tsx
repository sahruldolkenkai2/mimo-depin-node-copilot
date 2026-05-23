'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Activity } from 'lucide-react'
import { useNodeStore } from '@/lib/store'
import { Node } from '@/lib/types'

export default function NodesPage() {
  const nodes = useNodeStore((state) => state.nodes)
  const addNode = useNodeStore((state) => state.addNode)
  const deleteNode = useNodeStore((state) => state.deleteNode)
  const updateNode = useNodeStore((state) => state.updateNode)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    type: 'zcash' | 'filecoin' | 'arweave' | 'other'
    ip: string
    port: string
    processManager: 'systemd' | 'pm2' | 'docker'
  }>({
    name: '',
    type: 'zcash',
    ip: '',
    port: '',
    processManager: 'systemd',
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.ip.trim()) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      updateNode(editingId, {
        name: formData.name,
        type: formData.type,
        ip: formData.ip,
        port: formData.port ? parseInt(formData.port) : undefined,
        processManager: formData.processManager,
      })
      setEditingId(null)
    } else {
      const newNode: Node = {
        id: crypto.randomUUID(),
        name: formData.name,
        type: formData.type,
        ip: formData.ip,
        port: formData.port ? parseInt(formData.port) : undefined,
        processManager: formData.processManager,
        createdAt: new Date(),
      }
      addNode(newNode)
    }

    setFormData({
      name: '',
      type: 'zcash',
      ip: '',
      port: '',
      processManager: 'systemd',
    })
    setShowForm(false)
  }

  const handleEdit = (node: Node) => {
    setFormData({
      name: node.name,
      type: node.type,
      ip: node.ip,
      port: node.port?.toString() || '',
      processManager: node.processManager,
    })
    setEditingId(node.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      type: 'zcash',
      ip: '',
      port: '',
      processManager: 'systemd',
    })
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Node Registry</h1>
        <p className="text-slate-600 mt-2">Manage your DePIN nodes</p>
      </header>

      {/* Add Node Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Node</span>
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Node' : 'Add New Node'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Node Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., my-zcash-node"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Node Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
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
                  IP Address *
                </label>
                <input
                  type="text"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  placeholder="e.g., 192.168.1.100"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Port (Optional)
                </label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  placeholder="e.g., 8232"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Process Manager *
                </label>
                <select
                  value={formData.processManager}
                  onChange={(e) => setFormData({ ...formData, processManager: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {processManagers.map((pm) => (
                    <option key={pm.value} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {editingId ? 'Update Node' : 'Add Node'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Node List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Registered Nodes</h2>

        {nodes.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No nodes registered yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Your First Node
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{node.name}</h3>
                    <p className="text-sm text-slate-500">
                      {node.ip}
                      {node.port && `:${node.port}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {nodeTypes.find((t) => t.value === node.type)?.label}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {processManagers.find((pm) => pm.value === node.processManager)?.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Created: {new Date(node.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(node)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete node "${node.name}"?`)) {
                          deleteNode(node.id)
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
