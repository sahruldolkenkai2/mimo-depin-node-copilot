export interface Node {
  id: string
  name: string
  type: 'zcash' | 'filecoin' | 'arweave' | 'other'
  ip: string
  port?: number
  processManager: 'systemd' | 'pm2' | 'docker'
  createdAt: Date
  lastHealthCheck?: Date
}

export interface AnalysisResult {
  nodeId?: string
  logInput: string
  rootCause: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendedFix: string[]
  commands: string[]
  timestamp: Date
}

export interface HealthCheckResult {
  nodeId: string
  score: number
  checks: {
    cpu: boolean
    memory: boolean
    disk: boolean
    network: boolean
    process: boolean
  }
  warnings: string[]
  timestamp: Date
}
