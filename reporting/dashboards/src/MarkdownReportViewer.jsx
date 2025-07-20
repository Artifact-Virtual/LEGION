import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiFileText, FiDownload, FiRefreshCw, FiCalendar, FiTrendingUp, FiBarChart3 } from 'react-icons/fi';

// Sample executive reports data
const sampleReports = {
  executive: {
    title: "Executive Summary - Q4 2024",
    lastUpdated: "2024-12-15T10:30:00Z",
    type: "executive",
    content: `# Executive Summary - Q4 2024

## Key Performance Indicators

### Financial Performance
- **Revenue**: $2.4M (+15% QoQ)
- **Profit Margin**: 23.5% (+2.1% QoQ)
- **Operating Expenses**: $1.8M (-5% QoQ)

### Operational Metrics
- **Agent Efficiency**: 94.2% (+3.1% QoQ)
- **System Uptime**: 99.97% (industry leading)
- **Customer Satisfaction**: 4.8/5.0 (+0.3 QoQ)

## Strategic Initiatives

### AI Agent Optimization
Our multi-agent system has shown remarkable improvement in Q4:
- **Task Completion Rate**: 97.3%
- **Response Time**: < 200ms average
- **Error Rate**: 0.23% (industry best)

### Market Expansion
Successfully launched in 3 new markets:
- **North America**: 45% market penetration
- **Europe**: 28% market penetration  
- **Asia-Pacific**: 12% market penetration

## Risk Assessment

| Risk Category | Level | Mitigation Strategy |
|---------------|-------|-------------------|
| Market Volatility | Medium | Diversified portfolio |
| Technology Disruption | Low | Continuous innovation |
| Regulatory Changes | Medium | Compliance monitoring |

## Outlook for 2025

### Growth Projections
- **Revenue Target**: $3.2M (+33% YoY)
- **New Markets**: 5 additional regions
- **Agent Network**: Expansion to 25 specialized agents

### Investment Priorities
1. AI/ML research and development
2. Global infrastructure scaling
3. Talent acquisition and retention
4. Security and compliance enhancement

---
*Report generated on ${new Date().toLocaleDateString()} by Enterprise AI Analytics*`
  },
  operations: {
    title: "Operations Report - Real-time",
    lastUpdated: new Date().toISOString(),
    type: "operations",
    content: `# Operations Dashboard - Real-time Status

## System Performance

### Current Metrics
- **Active Agents**: 18/18 (100% operational)
- **Processing Queue**: 47 tasks pending
- **Average Response Time**: 185ms
- **Memory Usage**: 68% of allocated capacity

### Agent Status Overview

#### Finance Department
- **Revenue Analysis Agent**: ✅ Active (processing Q4 reports)
- **Cost Optimization Agent**: ✅ Active (analyzing vendor contracts)
- **Risk Assessment Agent**: ✅ Active (monitoring market trends)

#### Marketing Department  
- **Content Generation Agent**: ✅ Active (creating campaign materials)
- **Social Media Agent**: ✅ Active (scheduling posts)
- **Analytics Agent**: ⚠️ Warning (high load - 89% capacity)

#### Operations Department
- **Workflow Orchestrator**: ✅ Active (coordinating 12 processes)
- **Quality Assurance Agent**: ✅ Active (running automated tests)
- **Resource Manager**: ✅ Active (optimizing allocations)

## Recent Activities

### Last 24 Hours
- **Tasks Completed**: 1,247
- **Reports Generated**: 23
- **Alerts Resolved**: 8
- **System Updates**: 3

### Top Performing Agents
1. **Workflow Orchestrator** - 99.2% efficiency
2. **Revenue Analysis Agent** - 97.8% efficiency  
3. **Content Generation Agent** - 96.5% efficiency

## Infrastructure Status

### Database Performance
\`\`\`
CRM Database: 234ms average query time
Projects Database: 156ms average query time
Analytics Database: 278ms average query time
\`\`\`

### API Endpoints
- **Financial APIs**: 99.8% uptime
- **Public APIs**: 97.2% uptime
- **Internal APIs**: 100% uptime

## Alerts & Notifications

### Active Alerts
- **Medium Priority**: Marketing Analytics Agent approaching capacity limit
- **Low Priority**: Scheduled maintenance window in 6 hours

### Resolved Today
- Network latency spike (resolved 2 hours ago)
- Database optimization completed (1 hour ago)
- Agent communication timeout (resolved 30 minutes ago)

---
*Live report updated every 5 minutes*`
  },
  financial: {
    title: "Financial Analysis - December 2024",
    lastUpdated: "2024-12-15T08:00:00Z",
    type: "financial",
    content: `# Financial Analysis Report - December 2024

## Revenue Breakdown

### Primary Revenue Streams
- **Enterprise Subscriptions**: $1.8M (75% of total)
- **Professional Services**: $420K (17.5% of total)
- **API Usage Fees**: $180K (7.5% of total)

### Growth Metrics
\`\`\`json
{
  "monthly_recurring_revenue": "$2.4M",
  "annual_growth_rate": "47%",
  "customer_acquisition_cost": "$1,240",
  "lifetime_value": "$28,500",
  "churn_rate": "2.1%"
}
\`\`\`

## Cost Analysis

### Operational Expenses
| Category | Amount | % of Revenue |
|----------|--------|--------------|
| Infrastructure | $480K | 20% |
| Personnel | $720K | 30% |
| R&D | $360K | 15% |
| Marketing | $240K | 10% |
| Other | $120K | 5% |

### Cost Optimization Initiatives
- **Infrastructure Scaling**: 15% cost reduction through AI optimization
- **Process Automation**: 25% reduction in manual overhead
- **Vendor Consolidation**: 8% savings on third-party services

## Profitability Analysis

### Key Ratios
- **Gross Margin**: 78.2%
- **EBITDA Margin**: 31.5%
- **Net Profit Margin**: 23.7%
- **ROI**: 34.2%

### Benchmark Comparison
Our performance vs. industry averages:
- **Revenue Growth**: 47% vs 23% (industry)
- **Profit Margin**: 23.7% vs 18.3% (industry)
- **Customer Retention**: 97.9% vs 89.2% (industry)

## Cash Flow Projection

### Q1 2025 Forecast
- **Operating Cash Flow**: $850K
- **Free Cash Flow**: $620K
- **Cash Runway**: 18+ months

---
*Financial data verified by automated reconciliation systems*`
  }
};

function ReportSelector({ reports, selectedReport, onSelect }) {
  return (
    <div className="flex gap-2 mb-4">
      {Object.entries(reports).map(([key, report]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            selectedReport === key
              ? 'bg-artifact-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {report.title}
        </button>
      ))}
    </div>
  );
}

function ReportMetadata({ report }) {
  const getIcon = (type) => {
    switch (type) {
      case 'executive': return TrendingUp;
      case 'operations': return BarChart3;
      case 'financial': return Calendar;
      default: return FileText;
    }
  };

  const Icon = getIcon(report.type);

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-artifact-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">{report.title}</h3>
          <p className="text-sm text-gray-400">
            Last updated: {new Date(report.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-300" />
        </button>
        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
          <Download className="w-4 h-4 text-gray-300" />
        </button>
      </div>
    </div>
  );
}

export default function MarkdownReportViewer({ externalReports = null }) {
  const [selectedReport, setSelectedReport] = useState('executive');
  const [reports, setReports] = useState(sampleReports);
  const [isLoading, setIsLoading] = useState(false);

  // Use external reports if provided, otherwise use sample data
  useEffect(() => {
    if (externalReports) {
      setReports(externalReports);
    }
  }, [externalReports]);

  // Simulate fetching fresh report data
  const refreshReport = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update timestamp for demo
    setReports(prev => ({
      ...prev,
      [selectedReport]: {
        ...prev[selectedReport],
        lastUpdated: new Date().toISOString()
      }
    }));
    setIsLoading(false);
  };

  const currentReport = reports[selectedReport];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-artifact-400" />
          Executive Reports
        </h2>
        <button
          onClick={refreshReport}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-artifact-500 text-white rounded-lg hover:bg-artifact-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Report Selector */}
      <ReportSelector
        reports={reports}
        selectedReport={selectedReport}
        onSelect={setSelectedReport}
      />

      {/* Report Container */}
      <div className="glass-panel min-h-[600px]">
        {currentReport && (
          <>
            <ReportMetadata report={currentReport} />
            
            {/* Markdown Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styling for markdown elements
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mb-4 border-b border-artifact-500 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mb-3 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-white mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-gray-300 mb-3 space-y-1 pl-6">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-gray-300 mb-3 space-y-1 pl-6">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="list-disc list-inside">
                      {children}
                    </li>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-gray-600">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-white/10">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-600 px-4 py-2 text-left text-white font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-600 px-4 py-2 text-gray-300">
                      {children}
                    </td>
                  ),
                  code: ({ children, inline }) =>
                    inline ? (
                      <code className="bg-gray-800 text-artifact-300 px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto my-4">
                        <code className="font-mono text-sm">{children}</code>
                      </pre>
                    ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-artifact-500 pl-4 my-4 text-gray-300 italic">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">
                      {children}
                    </strong>
                  )
                }}
              >
                {currentReport.content}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
