export interface GroqAnalysisRequest {
  log: string
  nodeType?: string
}

export interface GroqAnalysisResponse {
  rootCause: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendedFix: string[]
  commands: string[]
}

export async function analyzeLogWithGroq(
  request: GroqAnalysisRequest
): Promise<GroqAnalysisResponse> {
  // Mock response for now - will integrate with actual Groq API
  // In production, replace with actual API call
  
  const mockResponses = [
    {
      rootCause: 'Process crashed due to out of memory',
      severity: 'critical' as const,
      recommendedFix: [
        'Increase memory limit',
        'Restart process with memory monitoring',
        'Check for memory leaks',
      ],
      commands: [
        'sudo systemctl restart node-service',
        'journalctl -u node-service -f',
      ],
    },
    {
      rootCause: 'Network connection timeout',
      severity: 'high' as const,
      recommendedFix: [
        'Check firewall settings',
        'Verify network connectivity',
        'Restart network service',
      ],
      commands: [
        'sudo ufw allow 8232/tcp',
        'sudo systemctl restart networking',
        'ping 8.8.8.8',
      ],
    },
    {
      rootCause: 'Disk space running low',
      severity: 'medium' as const,
      recommendedFix: [
        'Clean up temporary files',
        'Check for large log files',
        'Consider expanding disk',
      ],
      commands: [
        'sudo rm -rf /tmp/*',
        'sudo find /var/log -name "*.log" -size +100M -delete',
        'df -h',
      ],
    },
  ]

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Return random mock response for now
  const randomIndex = Math.floor(Math.random() * mockResponses.length)
  return mockResponses[randomIndex]
}

export async function generateHealthChecklist(nodeType?: string): Promise<string[]> {
  const baseChecks = [
    'Check CPU usage: top -bn1 | grep "Cpu(s)"',
    'Check memory: free -h',
    'Check disk space: df -h',
    'Check network connectivity: ping -c 3 8.8.8.8',
    'Check process status: ps aux | grep node',
  ]

  const typeSpecificChecks: Record<string, string[]> = {
    zcash: [
      'Check Zcash daemon: zcash-cli getinfo',
      'Check block height: zcash-cli getblockcount',
      'Check peers: zcash-cli getpeerinfo',
    ],
    filecoin: [
      'Check Lotus daemon: lotus sync status',
      'Check miner status: lotus-miner info',
      'Check storage deals: lotus client list-deals',
    ],
    arweave: [
      'Check Arweave node: curl http://localhost:1984/info',
      'Check sync status: curl http://localhost:1984/status',
      'Check wallet balance: curl http://localhost:1984/wallet',
    ],
  }

  const checks = [...baseChecks]
  if (nodeType && typeSpecificChecks[nodeType]) {
    checks.push(...typeSpecificChecks[nodeType])
  }

  return checks
}

export async function generateAutomationConfig(
  nodeType: string,
  processManager: 'systemd' | 'pm2' | 'docker',
  nodeName: string
): Promise<{ config: string; startupScript: string }> {
  const configs = {
    systemd: `[Unit]
Description=${nodeName} - ${nodeType} Node
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/home/node/${nodeName}
ExecStart=/usr/local/bin/${nodeType}-daemon --config /etc/${nodeName}/config.conf
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target`,

    pm2: `module.exports = {
  apps: [{
    name: "${nodeName}",
    script: "/usr/local/bin/${nodeType}-daemon",
    args: "--config /etc/${nodeName}/config.conf",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production"
    }
  }]
}`,

    docker: `version: '3.8'
services:
  ${nodeName}:
    image: ${nodeType}/node:latest
    container_name: ${nodeName}
    restart: unless-stopped
    volumes:
      - ./data:/data
      - ./config:/config
    ports:
      - "8232:8232"
    environment:
      - NODE_TYPE=${nodeType}
    command: ["--config", "/config/config.conf"]`,
  }

  const startupScripts = {
    systemd: `#!/bin/bash
# Install systemd service
sudo cp ${nodeName}.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable ${nodeName}
sudo systemctl start ${nodeName}
echo "Service ${nodeName} installed and started"`,

    pm2: `#!/bin/bash
# Install PM2
npm install -g pm2
pm2 start ${nodeName}.config.js
pm2 save
pm2 startup
echo "PM2 service ${nodeName} installed"`,

    docker: `#!/bin/bash
# Start Docker container
docker-compose -f ${nodeName}.docker-compose.yml up -d
echo "Docker container ${nodeName} started"`,
  }

  return {
    config: configs[processManager],
    startupScript: startupScripts[processManager],
  }
}
