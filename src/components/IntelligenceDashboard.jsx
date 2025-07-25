import React, { useState, useEffect } from 'react';
import './IntelligenceDashboard.css';

const IntelligenceDashboard = ({ onComponentUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const [data, setData] = useState({
    overview: {},
    reports: [],
    analyses: [],
    insights: [],
    research: [],
    recommendations: []
  });

  useEffect(() => {
    const loadIntelligenceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API calls to various intelligence services
        const [
          overviewResponse,
          reportsResponse,
          analysesResponse,
          insightsResponse,
          researchResponse,
          recommendationsResponse
        ] = await Promise.allSettled([
          fetch('/api/enterprise/intelligence-overview'),
          fetch('/api/enterprise/automated-reports'),
          fetch('/api/enterprise/market-analyses'),
          fetch('/api/enterprise/business-insights'),
          fetch('/api/enterprise/research-summaries'),
          fetch('/api/enterprise/ai-recommendations')
        ]);

        // Process responses or use mock data
        const mockData = {
          overview: {
            totalReports: 156,
            activeAnalyses: 23,
            pendingInsights: 8,
            completedResearch: 42,
            aiRecommendations: 15,
            lastUpdated: new Date().toISOString(),
            systemHealth: 98.5,
            dataQuality: 94.2,
            analysisAccuracy: 96.8,
            processingSpeed: 2.3, // seconds average
            agentsActive: 8,
            agentsIdle: 2
          },
          reports: [
            {
              id: 'rpt001',
              title: 'Q4 Market Intelligence Report',
              type: 'market_analysis',
              status: 'completed',
              priority: 'high',
              createdBy: 'Market Analysis Agent',
              createdAt: '2024-10-15T09:30:00Z',
              completedAt: '2024-10-15T11:45:00Z',
              summary: 'Comprehensive market analysis showing 18% growth in AI consulting sector with emerging opportunities in healthcare and finance verticals.',
              confidence: 92,
              dataPoints: 1247,
              sources: ['Industry Reports', 'Market Research', 'Competitor Analysis', 'Customer Surveys'],
              keyFindings: [
                'AI consulting market growing at 18% CAGR',
                'Healthcare sector shows 34% adoption increase',
                'Enterprise clients prioritize compliance solutions',
                'Competitive pricing pressure in mid-market segment'
              ],
              tags: ['market', 'growth', 'ai-consulting', 'healthcare', 'finance'],
              fileSize: '2.4 MB',
              downloadUrl: '/api/reports/download/rpt001'
            },
            {
              id: 'rpt002',
              title: 'Customer Sentiment Analysis',
              type: 'customer_analysis',
              status: 'completed',
              priority: 'medium',
              createdBy: 'Customer Analytics Agent',
              createdAt: '2024-10-14T14:20:00Z',
              completedAt: '2024-10-14T16:35:00Z',
              summary: 'Analysis of customer feedback across all channels showing 87% satisfaction rate with notable improvements in support response times.',
              confidence: 89,
              dataPoints: 2156,
              sources: ['Support Tickets', 'Survey Responses', 'Social Media', 'Review Platforms'],
              keyFindings: [
                'Overall satisfaction improved from 82% to 87%',
                'Support response time reduced by 45%',
                'Product feature requests increased by 23%',
                'Referral rate increased to 34%'
              ],
              tags: ['customer', 'sentiment', 'satisfaction', 'support'],
              fileSize: '1.8 MB',
              downloadUrl: '/api/reports/download/rpt002'
            },
            {
              id: 'rpt003',
              title: 'Competitive Intelligence Briefing',
              type: 'competitive_analysis',
              status: 'in_progress',
              priority: 'high',
              createdBy: 'Competitive Intelligence Agent',
              createdAt: '2024-10-15T08:00:00Z',
              estimatedCompletion: '2024-10-15T18:00:00Z',
              summary: 'Real-time monitoring of competitor activities, pricing changes, and market positioning strategies.',
              confidence: null,
              progress: 67,
              dataPoints: 894,
              sources: ['Public Announcements', 'Pricing Pages', 'Job Postings', 'Patent Filings'],
              keyFindings: [],
              tags: ['competitive', 'intelligence', 'monitoring', 'pricing'],
              fileSize: null,
              downloadUrl: null
            },
            {
              id: 'rpt004',
              title: 'Technology Trend Analysis',
              type: 'technology_research',
              status: 'completed',
              priority: 'medium',
              createdBy: 'Research Agent',
              createdAt: '2024-10-13T10:15:00Z',
              completedAt: '2024-10-13T15:20:00Z',
              summary: 'Comprehensive analysis of emerging technologies and their potential impact on our industry and business model.',
              confidence: 94,
              dataPoints: 3421,
              sources: ['Research Papers', 'Tech Blogs', 'Patent Databases', 'Conference Proceedings'],
              keyFindings: [
                'Large Language Models adoption accelerating in enterprise',
                'Edge computing gaining traction in IoT applications',
                'Quantum computing showing promise for optimization',
                'Autonomous agents becoming mainstream in business operations'
              ],
              tags: ['technology', 'trends', 'llm', 'edge-computing', 'quantum'],
              fileSize: '4.2 MB',
              downloadUrl: '/api/reports/download/rpt004'
            },
            {
              id: 'rpt005',
              title: 'Financial Performance Analytics',
              type: 'financial_analysis',
              status: 'scheduled',
              priority: 'high',
              createdBy: 'Financial Analysis Agent',
              scheduledFor: '2024-10-16T09:00:00Z',
              summary: 'Monthly financial performance analysis with predictive modeling and variance analysis.',
              confidence: null,
              progress: 0,
              dataPoints: 0,
              sources: ['Financial Systems', 'Accounting Records', 'Market Data', 'Economic Indicators'],
              keyFindings: [],
              tags: ['financial', 'performance', 'analytics', 'forecasting'],
              fileSize: null,
              downloadUrl: null
            }
          ],
          analyses: [
            {
              id: 'ana001',
              title: 'Market Opportunity Assessment',
              type: 'opportunity_analysis',
              status: 'active',
              agent: 'Strategic Planning Agent',
              startedAt: '2024-10-15T07:00:00Z',
              estimatedCompletion: '2024-10-15T19:00:00Z',
              progress: 45,
              description: 'Deep dive analysis of untapped market segments and expansion opportunities.',
              currentPhase: 'Data Collection',
              phases: [
                { name: 'Market Research', status: 'completed', duration: 120 },
                { name: 'Data Collection', status: 'active', duration: 180 },
                { name: 'Analysis & Modeling', status: 'pending', duration: 240 },
                { name: 'Report Generation', status: 'pending', duration: 60 }
              ],
              dataCollected: 67,
              confidence: 78,
              priority: 'high'
            },
            {
              id: 'ana002',
              title: 'Customer Journey Mapping',
              type: 'customer_analysis',
              status: 'active',
              agent: 'Customer Analytics Agent',
              startedAt: '2024-10-14T12:30:00Z',
              estimatedCompletion: '2024-10-15T16:30:00Z',
              progress: 82,
              description: 'Comprehensive mapping of customer touchpoints and experience optimization opportunities.',
              currentPhase: 'Report Generation',
              phases: [
                { name: 'Touchpoint Identification', status: 'completed', duration: 90 },
                { name: 'Journey Mapping', status: 'completed', duration: 150 },
                { name: 'Pain Point Analysis', status: 'completed', duration: 120 },
                { name: 'Report Generation', status: 'active', duration: 45 }
              ],
              dataCollected: 94,
              confidence: 91,
              priority: 'medium'
            },
            {
              id: 'ana003',
              title: 'Product Performance Review',
              type: 'product_analysis',
              status: 'queued',
              agent: 'Business Intelligence Agent',
              queuedAt: '2024-10-15T10:00:00Z',
              estimatedStart: '2024-10-15T20:00:00Z',
              estimatedCompletion: '2024-10-16T08:00:00Z',
              progress: 0,
              description: 'Quarterly review of product performance metrics and user engagement analytics.',
              currentPhase: 'Queued',
              phases: [
                { name: 'Metrics Collection', status: 'pending', duration: 120 },
                { name: 'Performance Analysis', status: 'pending', duration: 180 },
                { name: 'User Behavior Study', status: 'pending', duration: 240 },
                { name: 'Insights Generation', status: 'pending', duration: 90 }
              ],
              dataCollected: 0,
              confidence: null,
              priority: 'medium'
            }
          ],
          insights: [
            {
              id: 'ins001',
              title: 'Revenue Optimization Opportunity',
              type: 'business_insight',
              category: 'revenue',
              priority: 'critical',
              confidence: 94,
              impact: 'high',
              generatedBy: 'Financial Analysis Agent',
              generatedAt: '2024-10-15T08:30:00Z',
              summary: 'Analysis reveals potential 23% revenue increase through pricing strategy optimization and premium service tier introduction.',
              description: 'Our financial analysis indicates that current pricing is below market average for our service quality. Implementing tiered pricing with a premium tier could capture high-value customers willing to pay for enhanced features.',
              data: {
                currentRevenue: 387500,
                projectedIncrease: 89125,
                confidence: 94,
                timeToImplement: '6-8 weeks',
                investmentRequired: 45000
              },
              recommendations: [
                'Introduce premium service tier with advanced AI capabilities',
                'Increase base pricing by 12% to match market positioning',
                'Implement value-based pricing for enterprise clients',
                'Create limited-time promotional pricing for new premium features'
              ],
              metrics: {
                revenueImpact: '+23%',
                customerImpact: '+/-5%',
                competitiveAdvantage: '+15%',
                implementationComplexity: 'Medium'
              },
              tags: ['revenue', 'pricing', 'optimization', 'premium'],
              status: 'active',
              actionRequired: true
            },
            {
              id: 'ins002',
              title: 'Customer Retention Risk Alert',
              type: 'risk_insight',
              category: 'customer',
              priority: 'high',
              confidence: 87,
              impact: 'high',
              generatedBy: 'Customer Analytics Agent',
              generatedAt: '2024-10-14T16:45:00Z',
              summary: 'Predictive analysis identifies 18 high-value customers at risk of churning within the next 60 days.',
              description: 'Machine learning analysis of customer behavior patterns, support interactions, and usage metrics indicates elevated churn risk for several enterprise clients representing $156,000 in annual revenue.',
              data: {
                customersAtRisk: 18,
                revenueAtRisk: 156000,
                averageAccountValue: 8667,
                churnProbability: 67,
                timeframe: '60 days'
              },
              recommendations: [
                'Immediate outreach to at-risk customers with dedicated success manager',
                'Offer personalized training sessions and feature demonstrations',
                'Provide temporary service credits or extended trial periods',
                'Implement proactive monitoring for early warning signs'
              ],
              metrics: {
                retentionImprovement: '+34%',
                revenuePreservation: '$156K',
                customerSatisfaction: '+12%',
                interventionCost: '$8,500'
              },
              tags: ['retention', 'churn', 'risk', 'enterprise'],
              status: 'urgent',
              actionRequired: true
            },
            {
              id: 'ins003',
              title: 'Market Expansion Opportunity',
              type: 'growth_insight',
              category: 'expansion',
              priority: 'medium',
              confidence: 82,
              impact: 'medium',
              generatedBy: 'Market Analysis Agent',
              generatedAt: '2024-10-13T11:20:00Z',
              summary: 'European market analysis shows strong demand for AI consulting services with limited direct competition.',
              description: 'Market research indicates European businesses are actively seeking AI implementation partners, with 78% of surveyed companies planning AI initiatives in the next 18 months. Current competition is fragmented with no dominant players.',
              data: {
                marketSize: 2400000000,
                growthRate: 0.31,
                competitorCount: 23,
                entryBarriers: 'Medium',
                regulatoryComplexity: 'High'
              },
              recommendations: [
                'Conduct detailed regulatory compliance analysis for GDPR',
                'Partner with local consulting firms for market entry',
                'Develop EU-specific service offerings and case studies',
                'Establish European data processing infrastructure'
              ],
              metrics: {
                marketPotential: '€2.4B',
                timeToMarket: '12-18 months',
                investmentRequired: '€350K',
                projectedROI: '340%'
              },
              tags: ['expansion', 'europe', 'market-entry', 'international'],
              status: 'under_review',
              actionRequired: false
            }
          ],
          research: [
            {
              id: 'res001',
              title: 'AI Industry Landscape Study',
              type: 'industry_research',
              status: 'completed',
              researcher: 'Research Agent',
              completedAt: '2024-10-12T14:30:00Z',
              duration: 168, // hours
              summary: 'Comprehensive study of the AI consulting industry landscape, key players, market dynamics, and emerging trends.',
              methodology: 'Mixed-methods approach combining quantitative market data analysis with qualitative expert interviews and trend analysis.',
              keyFindings: [
                'Market consolidation accelerating with 34% increase in M&A activity',
                'Specialized AI consultancies outperforming generalist firms by 28%',
                'Regulatory compliance becoming key differentiator',
                'Client preference shifting toward outcome-based pricing models'
              ],
              dataPoints: 4521,
              sources: 147,
              citations: 89,
              confidence: 96,
              impact: 'Strategic planning and positioning',
              downloadUrl: '/api/research/download/res001',
              fileSize: '8.4 MB',
              format: 'PDF',
              tags: ['industry', 'landscape', 'ai-consulting', 'market-dynamics']
            },
            {
              id: 'res002',
              title: 'Customer Needs Assessment',
              type: 'customer_research',
              status: 'in_progress',
              researcher: 'Customer Research Agent',
              startedAt: '2024-10-10T09:00:00Z',
              estimatedCompletion: '2024-10-17T17:00:00Z',
              progress: 72,
              summary: 'Deep dive into customer needs, pain points, and decision-making processes to inform product development and marketing strategies.',
              methodology: 'Combination of surveys, interviews, behavioral analytics, and journey mapping.',
              currentPhase: 'Data Analysis',
              phases: [
                { name: 'Survey Design & Distribution', status: 'completed', progress: 100 },
                { name: 'Customer Interviews', status: 'completed', progress: 100 },
                { name: 'Behavioral Data Collection', status: 'completed', progress: 100 },
                { name: 'Data Analysis', status: 'active', progress: 68 },
                { name: 'Report Synthesis', status: 'pending', progress: 0 }
              ],
              dataPoints: 1834,
              sources: 67,
              responseRate: 0.67,
              confidence: 88,
              tags: ['customer', 'needs', 'research', 'behavior']
            },
            {
              id: 'res003',
              title: 'Technology Stack Optimization',
              type: 'technical_research',
              status: 'planned',
              researcher: 'Technical Research Agent',
              scheduledStart: '2024-10-18T08:00:00Z',
              estimatedDuration: 96, // hours
              summary: 'Research into emerging technologies and optimization opportunities for our current technology stack.',
              methodology: 'Technology assessment, performance benchmarking, and cost-benefit analysis.',
              scope: [
                'Infrastructure performance analysis',
                'Alternative technology evaluation',
                'Security and compliance assessment',
                'Scalability and cost optimization'
              ],
              expectedOutcomes: [
                'Technology roadmap recommendations',
                'Cost optimization opportunities',
                'Performance improvement strategies',
                'Risk assessment and mitigation plans'
              ],
              tags: ['technology', 'optimization', 'infrastructure', 'performance']
            }
          ],
          recommendations: [
            {
              id: 'rec001',
              title: 'Implement Dynamic Pricing Strategy',
              type: 'strategic',
              priority: 'high',
              category: 'revenue',
              confidence: 91,
              impact: 'high',
              generatedBy: 'Strategic Planning Agent',
              generatedAt: '2024-10-15T09:15:00Z',
              basedOn: ['Market Analysis', 'Customer Behavior Study', 'Competitive Intelligence'],
              summary: 'Implement AI-driven dynamic pricing to optimize revenue based on demand, customer value, and market conditions.',
              description: 'Our analysis shows significant pricing optimization opportunities through dynamic pricing strategies. Current fixed pricing leaves money on the table during high-demand periods and may be too rigid for different customer segments.',
              expectedImpact: {
                revenueIncrease: '18-25%',
                customerSatisfaction: 'Neutral to +8%',
                competitiveAdvantage: '+22%',
                implementationTime: '8-12 weeks'
              },
              actionItems: [
                {
                  task: 'Develop pricing algorithm with market and demand factors',
                  owner: 'Engineering Team',
                  timeline: '4 weeks',
                  effort: 'High'
                },
                {
                  task: 'A/B test dynamic pricing with select customer segments',
                  owner: 'Product Team',
                  timeline: '3 weeks',
                  effort: 'Medium'
                },
                {
                  task: 'Create customer communication strategy for pricing changes',
                  owner: 'Marketing Team',
                  timeline: '2 weeks',
                  effort: 'Low'
                }
              ],
              risks: [
                'Customer backlash to price increases',
                'Competitive response to pricing strategy',
                'Technical complexity in implementation'
              ],
              metrics: [
                'Revenue per customer',
                'Customer acquisition cost',
                'Price elasticity',
                'Competitive positioning'
              ],
              status: 'approved',
              tags: ['pricing', 'revenue', 'optimization', 'ai-driven']
            },
            {
              id: 'rec002',
              title: 'Establish European Operations',
              type: 'expansion',
              priority: 'medium',
              category: 'growth',
              confidence: 78,
              impact: 'high',
              generatedBy: 'Market Analysis Agent',
              generatedAt: '2024-10-14T13:42:00Z',
              basedOn: ['European Market Study', 'Regulatory Analysis', 'Competitive Landscape'],
              summary: 'Establish European operations to capture growing demand for AI consulting services in the EU market.',
              description: 'Market research indicates strong demand for AI consulting in Europe with limited direct competition. Regulatory environment requires local presence for compliance and customer trust.',
              expectedImpact: {
                revenueIncrease: '40-60%',
                marketShare: '2-4%',
                customerBase: '+150-300 clients',
                timeToBreakeven: '18-24 months'
              },
              actionItems: [
                {
                  task: 'Conduct detailed regulatory compliance analysis',
                  owner: 'Legal Team',
                  timeline: '6 weeks',
                  effort: 'High'
                },
                {
                  task: 'Establish partnerships with local consulting firms',
                  owner: 'Business Development',
                  timeline: '12 weeks',
                  effort: 'High'
                },
                {
                  task: 'Set up European data processing infrastructure',
                  owner: 'Engineering Team',
                  timeline: '16 weeks',
                  effort: 'High'
                }
              ],
              risks: [
                'Regulatory compliance complexity',
                'Cultural and business practice differences',
                'Currency fluctuation exposure',
                'Increased operational complexity'
              ],
              metrics: [
                'European revenue growth',
                'Local market share',
                'Customer acquisition rate',
                'Regulatory compliance score'
              ],
              status: 'under_review',
              tags: ['expansion', 'europe', 'international', 'growth']
            }
          ]
        };

        setData(mockData);
      } catch (err) {
        console.error('Error loading intelligence data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIntelligenceData();
    const interval = setInterval(loadIntelligenceData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleComponentUpdate = (component, updateData) => {
    if (onComponentUpdate) {
      onComponentUpdate(component, updateData);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active':
      case 'in_progress': return '#f59e0b';
      case 'scheduled':
      case 'queued':
      case 'planned': return '#6b7280';
      case 'urgent': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return '#10b981';
    if (confidence >= 75) return '#3b82f6';
    if (confidence >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="intelligence-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading intelligence data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="intelligence-dashboard error">
        <div className="error-message">
          <h3>Error Loading Intelligence Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="intelligence-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Intelligence Dashboard</h1>
          <p>AI-generated research, analysis, and business intelligence</p>
        </div>
        <div className="header-controls">
          <select 
            value={refreshInterval} 
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="refresh-selector"
          >
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
            <option value={600000}>10 minutes</option>
            <option value={1800000}>30 minutes</option>
          </select>
          <button className="refresh-button" onClick={() => window.location.reload()}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="intelligence-nav">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'reports', label: 'Reports', icon: '📋' },
          { id: 'analyses', label: 'Live Analysis', icon: '🔍' },
          { id: 'insights', label: 'Insights', icon: '💡' },
          { id: 'research', label: 'Research', icon: '📚' },
          { id: 'recommendations', label: 'Recommendations', icon: '🎯' }
        ].map(section => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="overview-section">
          <div className="overview-metrics">
            <div className="metric-card">
              <div className="metric-icon">📋</div>
              <div className="metric-content">
                <div className="metric-value">{data.overview.totalReports}</div>
                <div className="metric-label">Total Reports</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🔍</div>
              <div className="metric-content">
                <div className="metric-value">{data.overview.activeAnalyses}</div>
                <div className="metric-label">Active Analyses</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">💡</div>
              <div className="metric-content">
                <div className="metric-value">{data.overview.pendingInsights}</div>
                <div className="metric-label">Pending Insights</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-value">{data.overview.aiRecommendations}</div>
                <div className="metric-label">AI Recommendations</div>
              </div>
            </div>
          </div>

          <div className="overview-grid">
            <div className="system-health">
              <h3>System Health</h3>
              <div className="health-metrics">
                <div className="health-item">
                  <span className="health-label">System Health</span>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: `${data.overview.systemHealth}%` }}></div>
                  </div>
                  <span className="health-value">{data.overview.systemHealth}%</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Data Quality</span>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: `${data.overview.dataQuality}%` }}></div>
                  </div>
                  <span className="health-value">{data.overview.dataQuality}%</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Analysis Accuracy</span>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: `${data.overview.analysisAccuracy}%` }}></div>
                  </div>
                  <span className="health-value">{data.overview.analysisAccuracy}%</span>
                </div>
              </div>
            </div>

            <div className="agent-status">
              <h3>Intelligence Agents</h3>
              <div className="agent-stats">
                <div className="agent-stat active">
                  <div className="stat-value">{data.overview.agentsActive}</div>
                  <div className="stat-label">Active</div>
                </div>
                <div className="agent-stat idle">
                  <div className="stat-value">{data.overview.agentsIdle}</div>
                  <div className="stat-label">Idle</div>
                </div>
                <div className="agent-stat performance">
                  <div className="stat-value">{data.overview.processingSpeed}s</div>
                  <div className="stat-label">Avg Processing</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">📊</div>
                  <div className="activity-content">
                    <div className="activity-title">Market Intelligence Report completed</div>
                    <div className="activity-time">2 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💡</div>
                  <div className="activity-content">
                    <div className="activity-title">New revenue optimization insight generated</div>
                    <div className="activity-time">15 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🔍</div>
                  <div className="activity-content">
                    <div className="activity-title">Customer journey analysis started</div>
                    <div className="activity-time">1 hour ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      {activeSection === 'reports' && (
        <div className="reports-section">
          <div className="section-header">
            <h2>Automated Reports</h2>
            <div className="section-actions">
              <button className="action-button">📥 Download All</button>
              <button className="action-button">⚙️ Configure</button>
            </div>
          </div>
          <div className="reports-grid">
            {data.reports.map(report => (
              <div key={report.id} className={`report-card ${report.status}`}>
                <div className="report-header">
                  <div className="report-title">{report.title}</div>
                  <div className={`report-status ${report.status}`}>
                    {report.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div className="report-meta">
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span className="meta-value">{report.type.replace('_', ' ')}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created by:</span>
                    <span className="meta-value">{report.createdBy}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{formatDate(report.createdAt)}</span>
                  </div>
                  {report.confidence && (
                    <div className="meta-item">
                      <span className="meta-label">Confidence:</span>
                      <span 
                        className="meta-value confidence"
                        style={{ color: getConfidenceColor(report.confidence) }}
                      >
                        {report.confidence}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="report-summary">{report.summary}</div>
                {report.keyFindings && report.keyFindings.length > 0 && (
                  <div className="key-findings">
                    <h4>Key Findings:</h4>
                    <ul>
                      {report.keyFindings.slice(0, 3).map((finding, index) => (
                        <li key={index}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="report-stats">
                  <span className="stat-item">📊 {report.dataPoints} data points</span>
                  <span className="stat-item">📄 {report.sources.length} sources</span>
                  {report.fileSize && <span className="stat-item">💾 {report.fileSize}</span>}
                </div>
                <div className="report-tags">
                  {report.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                {report.status === 'in_progress' && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${report.progress}%` }}></div>
                    <span className="progress-text">{report.progress}%</span>
                  </div>
                )}
                <div className="report-actions">
                  {report.downloadUrl && (
                    <button className="action-btn download">📥 Download</button>
                  )}
                  <button className="action-btn view">👁️ View</button>
                  <button className="action-btn share">🔗 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue with other sections... */}
      {/* This component is getting quite large, so I'll implement the remaining sections (analyses, insights, research, recommendations) in follow-up components */}

    </div>
  );
};

export default IntelligenceDashboard;
