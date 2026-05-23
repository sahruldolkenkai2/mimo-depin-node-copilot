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
  // Real Groq API integration
  const apiKey = process.env.GROQ_API_KEY
  
  if (!apiKey) {
    console.warn('GROQ_API_KEY not set, using mock response')
    return getMockResponse()
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a DePIN (Decentralized Physical Infrastructure Network) node expert. 
            Analyze error logs from node operators and provide:
            1. Root cause (1-2 sentences)
            2. Severity level (critical/high/medium/low)
            3. Recommended fix steps (3-5 bullet points)
            4. Shell commands to execute (copy-paste ready)
            
            Node type: ${request.nodeType || 'general'}
            Be concise and actionable.`,
          },
          {
            role: 'user',
            content: `Analyze this node error log:\n\n${request.log}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || ''
    
    return parseGroqResponse(aiResponse)
  } catch (error) {
    console.error('Groq API failed:', error)
    return getMockResponse() // Fallback to mock
  }
}

function parseGroqResponse(text: string): GroqAnalysisResponse {
  // Parse AI response into structured format
  // This is a simplified parser - you might want to improve it
  
  const lines = text.split('\n')
  let rootCause = ''
  let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  const recommendedFix: string[] = []
  const commands: string[] = []

  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    if (lowerLine.includes('root cause') || lowerLine.includes('cause:')) {
      rootCause = line.replace(/root cause:|cause:/i, '').trim()
    }
    
    if (lowerLine.includes('severity:')) {
      if (lowerLine.includes('critical')) severity = 'critical'
      else if (lowerLine.includes('high')) severity = 'high'
      else if (lowerLine.includes('medium')) severity = 'medium'
      else if (lowerLine.includes('low')) severity = 'low'
    }
    
    if (line.includes('•') || line.includes('-') || line.match(/^\d+\./)) {
      const cleanLine = line.replace(/^[•\-\d\.\s]+/, '').trim()
      if (cleanLine && !cleanLine.includes('severity') && !cleanLine.includes('root cause')) {
        recommendedFix.push(cleanLine)
      }
    }
    
    if (line.includes('$ ') || line.includes('sudo ') || line.includes('systemctl')) {
      const command = line.replace(/^\$ /, '').trim()
      if (command && command.length > 5) {
        commands.push(command)
      }
    }
  }

  // Fallback if parsing fails
  if (!rootCause || recommendedFix.length === 0) {
    return getMockResponse()
  }

  return {
    rootCause,
    severity,
    recommendedFix: recommendedFix.slice(0, 5),
    commands: commands.slice(0, 3),
  }
}

function getMockResponse(): GroqAnalysisResponse {
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
