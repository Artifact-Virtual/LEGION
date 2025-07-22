# LEGION Enterprise Dashboards

Advanced, real-time dashboards for executive, operational, financial, security, and economic intelligence. Includes system monitoring and agent management.

## Features

- **14 Specialized Views:** Enterprise, Executive, Operations, Agents, Reports, Analytics, Infrastructure, Compliance, Finance, Marketing, Weather, Health, Energy, Business
- **System Monitoring:** Real-time messages, alerts, API/database health
- **Financial Intelligence:** Live market data, news, weather, advanced charting
- **Agent Management:** Directory, health, compliance, financial, marketing dashboards

## Technology

- **Frontend:** React 18, Tailwind CSS, React Icons, Lightweight-Charts
- **Data:** Real-time streaming, auto-refresh
- **API Integrations:** Polygon, Alpha Vantage, CoinGecko, Frankfurter, NewsAPI, AbuseIPDB, VirusTotal, NASA, OpenWeatherMap, custom endpoints
- **Security:** Environment variables, token-based authentication, CORS proxy, no client-side secrets

## Setup

### Environment Variables

```bash
REACT_APP_POLYGON_API_KEY=your_polygon_key
REACT_APP_ALPHAVANTAGE_API_KEY=your_alphavantage_key
REACT_APP_NEWSAPI_KEY=your_newsapi_key
REACT_APP_NASA_API_KEY=your_nasa_key
REACT_APP_ABUSEIPDB_API_KEY=your_abuseipdb_key
REACT_APP_VIRUSTOTAL_API_KEY=your_virustotal_key
REACT_APP_OPENWEATHERMAP_API_KEY=your_openweather_key
REACT_APP_API_ADMIN_TOKEN=secure_admin_token
REACT_APP_API_MANAGER_TOKEN=secure_manager_token
REACT_APP_API_VIEWER_TOKEN=secure_viewer_token
```

### Commands

```bash
npm install      # Install dependencies
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## Security & Access

- Role-based tokens: admin, manager, viewer
- Contextual data filtering
- Audit logging
- No public endpoints; all keys via environment variables

## Compliance

- Built-in compliance and regulatory tools
- Secure authentication and monitoring
- No hardcoded secrets

