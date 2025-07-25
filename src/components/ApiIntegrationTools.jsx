import React, { useState, useEffect } from 'react';
import './ApiIntegrationTools.css';

const ApiIntegrationTools = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('discover');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);

  // Mock data - replace with real API integration
  const [integrationData, setIntegrationData] = useState({
    availableApis: [
      {
        id: 'crypto_data',
        name: 'CryptoCompare API',
        category: 'Financial',
        description: 'Real-time cryptocurrency data and market information',
        provider: 'CryptoCompare',
        rating: 4.8,
        popularity: 95,
        status: 'available',
        pricing: 'Freemium',
        endpoints: 42,
        documentation: 'https://cryptocompare.com/api',
        features: ['Real-time prices', 'Historical data', 'Market cap', 'Trading volume'],
        supportedMethods: ['GET', 'POST'],
        authType: 'API Key',
        rateLimit: '2000/hour',
        responseFormat: 'JSON',
        sampleEndpoint: '/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR',
        integrationComplexity: 'Easy',
        estimatedSetupTime: '15 minutes'
      },
      {
        id: 'sentiment_analysis',
        name: 'TextRazor Sentiment API',
        category: 'AI/ML',
        description: 'Advanced text analysis and sentiment detection',
        provider: 'TextRazor',
        rating: 4.6,
        popularity: 78,
        status: 'available',
        pricing: 'Pay per use',
        endpoints: 18,
        documentation: 'https://textrazor.com/docs',
        features: ['Sentiment analysis', 'Entity extraction', 'Topic classification', 'Language detection'],
        supportedMethods: ['POST'],
        authType: 'API Key',
        rateLimit: '500/day',
        responseFormat: 'JSON/XML',
        sampleEndpoint: '/analyze',
        integrationComplexity: 'Medium',
        estimatedSetupTime: '30 minutes'
      },
      {
        id: 'email_validation',
        name: 'ZeroBounce Email API',
        category: 'Utility',
        description: 'Email validation and verification services',
        provider: 'ZeroBounce',
        rating: 4.9,
        popularity: 85,
        status: 'available',
        pricing: 'Credit-based',
        endpoints: 12,
        documentation: 'https://zerobounce.net/docs',
        features: ['Email validation', 'Bounce detection', 'Spam trap detection', 'Domain validation'],
        supportedMethods: ['GET', 'POST'],
        authType: 'API Key',
        rateLimit: '100/minute',
        responseFormat: 'JSON',
        sampleEndpoint: '/validate?email=test@example.com',
        integrationComplexity: 'Easy',
        estimatedSetupTime: '10 minutes'
      },
      {
        id: 'geolocation',
        name: 'IPGeolocation API',
        category: 'Utility',
        description: 'IP geolocation and timezone information',
        provider: 'IPGeolocation',
        rating: 4.7,
        popularity: 82,
        status: 'available',
        pricing: 'Freemium',
        endpoints: 8,
        documentation: 'https://ipgeolocation.io/documentation',
        features: ['IP geolocation', 'Timezone data', 'ISP information', 'Security threats'],
        supportedMethods: ['GET'],
        authType: 'API Key',
        rateLimit: '1000/month',
        responseFormat: 'JSON/XML',
        sampleEndpoint: '/ipgeo?apiKey=YOUR_KEY',
        integrationComplexity: 'Easy',
        estimatedSetupTime: '5 minutes'
      },
      {
        id: 'video_processing',
        name: 'Cloudinary Video API',
        category: 'Media',
        description: 'Video processing, optimization, and delivery',
        provider: 'Cloudinary',
        rating: 4.5,
        popularity: 73,
        status: 'available',
        pricing: 'Usage-based',
        endpoints: 35,
        documentation: 'https://cloudinary.com/documentation',
        features: ['Video upload', 'Format conversion', 'Quality optimization', 'CDN delivery'],
        supportedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        authType: 'OAuth 2.0',
        rateLimit: '5000/hour',
        responseFormat: 'JSON',
        sampleEndpoint: '/video/upload',
        integrationComplexity: 'Medium',
        estimatedSetupTime: '45 minutes'
      },
      {
        id: 'blockchain_data',
        name: 'Moralis Web3 API',
        category: 'Blockchain',
        description: 'Comprehensive Web3 and blockchain data',
        provider: 'Moralis',
        rating: 4.4,
        popularity: 68,
        status: 'available',
        pricing: 'Tiered',
        endpoints: 67,
        documentation: 'https://docs.moralis.io',
        features: ['NFT data', 'Token balances', 'Transaction history', 'DeFi protocols'],
        supportedMethods: ['GET', 'POST'],
        authType: 'API Key',
        rateLimit: '25000/month',
        responseFormat: 'JSON',
        sampleEndpoint: '/balance/0x...',
        integrationComplexity: 'Hard',
        estimatedSetupTime: '90 minutes'
      }
    ],
    integrationTemplates: [
      {
        id: 'rest_template',
        name: 'REST API Integration',
        description: 'Standard REST API integration template with authentication',
        type: 'REST',
        complexity: 'Easy',
        features: ['HTTP methods', 'Header management', 'Error handling', 'Rate limiting'],
        codeSnippet: `// REST API Integration Template
const apiConfig = {
  baseURL: 'https://api.example.com',
  apiKey: process.env.API_KEY,
  timeout: 5000
};

async function makeRequest(endpoint, method = 'GET', data = null) {
  try {
    const response = await fetch(\`\${apiConfig.baseURL}\${endpoint}\`, {
      method,
      headers: {
        'Authorization': \`Bearer \${apiConfig.apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });
    
    if (!response.ok) {
      throw new Error(\`API Error: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}`
      },
      {
        id: 'graphql_template',
        name: 'GraphQL Integration',
        description: 'GraphQL API integration with query builder',
        type: 'GraphQL',
        complexity: 'Medium',
        features: ['Query builder', 'Mutation support', 'Subscription handling', 'Schema validation'],
        codeSnippet: `// GraphQL Integration Template
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: \`Bearer \${process.env.GRAPHQL_TOKEN}\`
  }
});

const GET_DATA_QUERY = gql\`
  query GetData($limit: Int!, $offset: Int!) {
    items(limit: $limit, offset: $offset) {
      id
      name
      description
      createdAt
    }
  }
\`;

async function fetchData(limit = 10, offset = 0) {
  try {
    const { data } = await client.query({
      query: GET_DATA_QUERY,
      variables: { limit, offset }
    });
    return data.items;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
}`
      },
      {
        id: 'webhook_template',
        name: 'Webhook Integration',
        description: 'Webhook receiver and processor template',
        type: 'Webhook',
        complexity: 'Medium',
        features: ['Signature verification', 'Event routing', 'Retry logic', 'Dead letter queue'],
        codeSnippet: `// Webhook Integration Template
const crypto = require('crypto');
const express = require('express');

const app = express();
app.use(express.json());

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook event
  const { event, data } = req.body;
  
  switch (event) {
    case 'user.created':
      handleUserCreated(data);
      break;
    case 'payment.completed':
      handlePaymentCompleted(data);
      break;
    default:
      console.log('Unknown event:', event);
  }
  
  res.status(200).send('OK');
});`
      }
    ],
    integrationGuides: [
      {
        id: 'getting_started',
        title: 'Getting Started with API Integration',
        description: 'Step-by-step guide for beginners',
        steps: [
          'Choose your API provider',
          'Sign up and get API credentials',
          'Read the documentation',
          'Test with sample requests',
          'Implement error handling',
          'Add rate limiting',
          'Monitor and log usage'
        ],
        estimatedTime: '2 hours',
        difficulty: 'Beginner'
      },
      {
        id: 'authentication',
        title: 'API Authentication Methods',
        description: 'Complete guide to API authentication',
        steps: [
          'Understand different auth types',
          'Implement API key authentication',
          'Set up OAuth 2.0 flow',
          'Handle token refresh',
          'Secure credential storage',
          'Test authentication flow'
        ],
        estimatedTime: '3 hours',
        difficulty: 'Intermediate'
      },
      {
        id: 'best_practices',
        title: 'API Integration Best Practices',
        description: 'Professional-grade integration patterns',
        steps: [
          'Design error handling strategy',
          'Implement exponential backoff',
          'Add comprehensive logging',
          'Set up monitoring alerts',
          'Create integration tests',
          'Document your integration',
          'Plan for scaling'
        ],
        estimatedTime: '4 hours',
        difficulty: 'Advanced'
      }
    ],
    activeIntegrations: [
      {
        id: 'financial_data',
        name: 'Financial Data API',
        status: 'active',
        health: 'healthy',
        lastUsed: '2024-01-20T14:30:00Z',
        requestsToday: 2847,
        errorRate: 1.2
      },
      {
        id: 'social_analytics',
        name: 'Social Analytics API',
        status: 'active',
        health: 'warning',
        lastUsed: '2024-01-20T14:25:00Z',
        requestsToday: 1923,
        errorRate: 3.8
      }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredApis = integrationData.availableApis.filter(api => {
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'easy': return '#28a745';
      case 'medium': return '#ffc107';
      case 'hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="api-integration-tools loading">
        <div className="loading-spinner">
          <i className="fas fa-plug fa-spin"></i>
          <p>Loading integration tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-integration-tools">
      {/* Header */}
      <div className="integration-header">
        <div className="header-info">
          <h2>
            <i className="fas fa-plug"></i>
            API Integration Tools
          </h2>
          <p>Discover, configure, and manage new API integrations for your enterprise</p>
        </div>
        <div className="header-controls">
          <div className="view-toggle">
            {['discover', 'templates', 'guides', 'manage'].map(view => (
              <button
                key={view}
                className={`view-btn ${activeView === view ? 'active' : ''}`}
                onClick={() => setActiveView(view)}
              >
                {view}
              </button>
            ))}
          </div>
          <button 
            className="add-integration-btn"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus"></i>
            Add Integration
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'discover' && (
        <div className="discover-section">
          {/* Search and Filters */}
          <div className="discover-filters">
            <div className="search-group">
              <div className="search-input">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Financial">Financial</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Utility">Utility</option>
                <option value="Media">Media</option>
                <option value="Blockchain">Blockchain</option>
              </select>
            </div>
            
            <div className="sort-group">
              <label>Sort by:</label>
              <select>
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {/* API Discovery Grid */}
          <div className="api-discovery-grid">
            {filteredApis.map(api => (
              <div key={api.id} className="api-card">
                <div className="api-card-header">
                  <div className="api-basic-info">
                    <h3>{api.name}</h3>
                    <div className="api-provider">by {api.provider}</div>
                    <div className="api-category">{api.category}</div>
                  </div>
                  <div className="api-metrics">
                    <div className="api-rating">
                      <div className="rating-stars">
                        {getRatingStars(api.rating)}
                      </div>
                      <span className="rating-value">{api.rating}</span>
                    </div>
                    <div className="api-popularity">
                      <div className="popularity-bar">
                        <div 
                          className="popularity-fill"
                          style={{ width: `${api.popularity}%` }}
                        ></div>
                      </div>
                      <span className="popularity-value">{api.popularity}% popular</span>
                    </div>
                  </div>
                </div>
                
                <div className="api-description">
                  <p>{api.description}</p>
                </div>
                
                <div className="api-features">
                  <div className="features-title">Key Features:</div>
                  <div className="features-list">
                    {api.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                    {api.features.length > 3 && (
                      <span className="feature-more">+{api.features.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div className="api-technical-info">
                  <div className="tech-row">
                    <span className="tech-label">Endpoints:</span>
                    <span className="tech-value">{api.endpoints}</span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Auth Type:</span>
                    <span className="tech-value">{api.authType}</span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Rate Limit:</span>
                    <span className="tech-value">{api.rateLimit}</span>
                  </div>
                  <div className="tech-row">
                    <span className="tech-label">Complexity:</span>
                    <span 
                      className="tech-value complexity"
                      style={{ color: getComplexityColor(api.integrationComplexity) }}
                    >
                      {api.integrationComplexity}
                    </span>
                  </div>
                </div>
                
                <div className="api-pricing">
                  <div className="pricing-info">
                    <span className="pricing-label">Pricing:</span>
                    <span className="pricing-value">{api.pricing}</span>
                  </div>
                  <div className="setup-time">
                    <i className="fas fa-clock"></i>
                    <span>~{api.estimatedSetupTime}</span>
                  </div>
                </div>
                
                <div className="api-actions">
                  <button 
                    className="api-btn primary"
                    onClick={() => setSelectedApi(api)}
                  >
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  <button className="api-btn secondary">
                    <i className="fas fa-download"></i>
                    Quick Start
                  </button>
                  <button className="api-btn tertiary">
                    <i className="fas fa-bookmark"></i>
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'templates' && (
        <div className="templates-section">
          <div className="templates-header">
            <h3>Integration Templates</h3>
            <p>Pre-built templates to accelerate your API integration development</p>
          </div>
          
          <div className="templates-grid">
            {integrationData.integrationTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>
                  <div className="template-meta">
                    <div className="template-type">{template.type}</div>
                    <div 
                      className="template-complexity"
                      style={{ color: getComplexityColor(template.complexity) }}
                    >
                      {template.complexity}
                    </div>
                  </div>
                </div>
                
                <div className="template-features">
                  <div className="features-title">Includes:</div>
                  <ul>
                    {template.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="template-code">
                  <div className="code-header">
                    <span>Code Preview:</span>
                    <button className="copy-btn">
                      <i className="fas fa-copy"></i>
                      Copy
                    </button>
                  </div>
                  <pre className="code-block">
                    <code>{template.codeSnippet}</code>
                  </pre>
                </div>
                
                <div className="template-actions">
                  <button className="template-btn primary">
                    <i className="fas fa-download"></i>
                    Use Template
                  </button>
                  <button className="template-btn secondary">
                    <i className="fas fa-code"></i>
                    View Full Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'guides' && (
        <div className="guides-section">
          <div className="guides-header">
            <h3>Integration Guides</h3>
            <p>Comprehensive guides to help you master API integration</p>
          </div>
          
          <div className="guides-grid">
            {integrationData.integrationGuides.map(guide => (
              <div key={guide.id} className="guide-card">
                <div className="guide-header">
                  <h4>{guide.title}</h4>
                  <p>{guide.description}</p>
                </div>
                
                <div className="guide-meta">
                  <div className="guide-time">
                    <i className="fas fa-clock"></i>
                    <span>{guide.estimatedTime}</span>
                  </div>
                  <div 
                    className="guide-difficulty"
                    style={{ 
                      color: guide.difficulty === 'Beginner' ? '#28a745' :
                             guide.difficulty === 'Intermediate' ? '#ffc107' : '#dc3545'
                    }}
                  >
                    <i className="fas fa-signal"></i>
                    <span>{guide.difficulty}</span>
                  </div>
                </div>
                
                <div className="guide-steps">
                  <div className="steps-title">What you'll learn:</div>
                  <ol>
                    {guide.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="guide-actions">
                  <button className="guide-btn primary">
                    <i className="fas fa-play"></i>
                    Start Guide
                  </button>
                  <button className="guide-btn secondary">
                    <i className="fas fa-bookmark"></i>
                    Save for Later
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'manage' && (
        <div className="manage-section">
          <div className="manage-header">
            <h3>Active Integrations</h3>
            <p>Monitor and manage your current API integrations</p>
          </div>
          
          <div className="active-integrations">
            {integrationData.activeIntegrations.map(integration => (
              <div key={integration.id} className="integration-item">
                <div className="integration-info">
                  <div className="integration-name">{integration.name}</div>
                  <div className="integration-status">
                    <span 
                      className="status-indicator"
                      style={{ 
                        backgroundColor: integration.health === 'healthy' ? '#28a745' :
                                        integration.health === 'warning' ? '#ffc107' : '#dc3545'
                      }}
                    ></span>
                    <span className="status-text">{integration.health}</span>
                  </div>
                </div>
                
                <div className="integration-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Last Used:</span>
                    <span className="metric-value">{formatTimeAgo(integration.lastUsed)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Requests Today:</span>
                    <span className="metric-value">{integration.requestsToday.toLocaleString()}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Error Rate:</span>
                    <span 
                      className="metric-value"
                      style={{ color: integration.errorRate > 3 ? '#dc3545' : '#28a745' }}
                    >
                      {integration.errorRate}%
                    </span>
                  </div>
                </div>
                
                <div className="integration-actions">
                  <button className="integration-btn primary">
                    <i className="fas fa-cog"></i>
                    Configure
                  </button>
                  <button className="integration-btn secondary">
                    <i className="fas fa-chart-line"></i>
                    Analytics
                  </button>
                  <button className="integration-btn tertiary">
                    <i className="fas fa-pause"></i>
                    Pause
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="integration-stats">
            <h4>Integration Statistics</h4>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-value">12</div>
                <div className="stat-label">Total Integrations</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">98.7%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">4,770</div>
                <div className="stat-label">Requests Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">2.1%</div>
                <div className="stat-label">Avg Error Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Details Modal */}
      {selectedApi && (
        <div className="api-modal-overlay" onClick={() => setSelectedApi(null)}>
          <div className="api-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedApi.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedApi(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="api-details">
                <div className="details-section">
                  <h4>API Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Provider:</span>
                      <span className="detail-value">{selectedApi.provider}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{selectedApi.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rating:</span>
                      <span className="detail-value">{selectedApi.rating}/5</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pricing:</span>
                      <span className="detail-value">{selectedApi.pricing}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Auth Type:</span>
                      <span className="detail-value">{selectedApi.authType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rate Limit:</span>
                      <span className="detail-value">{selectedApi.rateLimit}</span>
                    </div>
                  </div>
                </div>
                
                <div className="details-section">
                  <h4>Sample Endpoint</h4>
                  <div className="endpoint-example">
                    <code>{selectedApi.sampleEndpoint}</code>
                  </div>
                </div>
                
                <div className="details-section">
                  <h4>Features</h4>
                  <div className="features-detailed">
                    {selectedApi.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <i className="fas fa-check"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="details-section">
                  <h4>Technical Details</h4>
                  <div className="tech-details">
                    <div className="tech-item">
                      <span className="tech-label">Supported Methods:</span>
                      <span className="tech-value">{selectedApi.supportedMethods.join(', ')}</span>
                    </div>
                    <div className="tech-item">
                      <span className="tech-label">Response Format:</span>
                      <span className="tech-value">{selectedApi.responseFormat}</span>
                    </div>
                    <div className="tech-item">
                      <span className="tech-label">Setup Time:</span>
                      <span className="tech-value">{selectedApi.estimatedSetupTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn primary">
                <i className="fas fa-plus"></i>
                Add Integration
              </button>
              <button className="modal-btn secondary">
                <i className="fas fa-external-link-alt"></i>
                View Documentation
              </button>
              <button className="modal-btn tertiary">
                <i className="fas fa-bookmark"></i>
                Save for Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="add-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom API Integration</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="add-form">
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-group">
                    <label>API Name:</label>
                    <input type="text" placeholder="Enter API name" />
                  </div>
                  <div className="form-group">
                    <label>Base URL:</label>
                    <input type="url" placeholder="https://api.example.com" />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea placeholder="Describe what this API does"></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>Authentication</h4>
                  <div className="form-group">
                    <label>Auth Type:</label>
                    <select>
                      <option>API Key</option>
                      <option>Bearer Token</option>
                      <option>OAuth 2.0</option>
                      <option>Basic Auth</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>API Key/Token:</label>
                    <input type="password" placeholder="Enter your API key" />
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>Configuration</h4>
                  <div className="form-group">
                    <label>Rate Limit:</label>
                    <input type="text" placeholder="e.g., 1000/hour" />
                  </div>
                  <div className="form-group">
                    <label>Timeout (seconds):</label>
                    <input type="number" defaultValue="30" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn primary">
                <i className="fas fa-plus"></i>
                Add Integration
              </button>
              <button className="modal-btn secondary">
                <i className="fas fa-vial"></i>
                Test Connection
              </button>
              <button 
                className="modal-btn tertiary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiIntegrationTools;
