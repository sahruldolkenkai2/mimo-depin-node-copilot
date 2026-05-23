import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Node, AnalysisResult, HealthCheckResult } from './types'

interface NodeStore {
  nodes: Node[]
  analyses: AnalysisResult[]
  healthChecks: HealthCheckResult[]
  addNode: (node: Node) => void
  deleteNode: (id: string) => void
  updateNode: (id: string, node: Partial<Node>) => void
  addAnalysis: (analysis: AnalysisResult) => void
  addHealthCheck: (check: HealthCheckResult) => void
  getNodeById: (id: string) => Node | undefined
  getAnalysesByNode: (nodeId: string) => AnalysisResult[]
}

export const useNodeStore = create<NodeStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      analyses: [],
      healthChecks: [],

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
        })),

      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        })),

      addAnalysis: (analysis) =>
        set((state) => ({
          analyses: [analysis, ...state.analyses],
        })),

      addHealthCheck: (check) =>
        set((state) => ({
          healthChecks: [check, ...state.healthChecks],
        })),

      getNodeById: (id) => {
        const state = get()
        return state.nodes.find((n) => n.id === id)
      },

      getAnalysesByNode: (nodeId) => {
        const state = get()
        return state.analyses.filter((a) => a.nodeId === nodeId)
      },
    }),
    {
      name: 'node-store',
    }
  )
)
