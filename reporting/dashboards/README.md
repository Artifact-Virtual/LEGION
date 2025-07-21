# LEGION Enterprise Dashboards

This directory contains advanced, real-time dashboards for executive, operational, financial, security, and economic intelligence.

## Dashboard Modules

- Markets: Live financial market data, candlestick charts, and summary tables (stocks, crypto, forex)
- News: Real-time news stream and trending topics (NewsAPI)
- Security: Cybersecurity threat map (AbuseIPDB), IOC feed (VirusTotal), posture matrix
- Economy: Global indicators (World Bank, IMF), GDP, inflation, unemployment
- Science & Weather: Data integration ready

## Technology Stack

- React (JS/TS), Tailwind CSS for UI/UX
- Lightweight-Charts for financial charts
- Direct API integration: Marketstack, CoinGecko, Frankfurter, NewsAPI, AbuseIPDB, VirusTotal, World Bank, IMF
- No placeholder data; all sources are live
- Modular, tab-based layout with sidebar/topbar, responsive design

## Implementation Status

- Markets, News, Security, Economy tabs fully operational with live data
- Science and Weather tabs scaffolded, ready for integration
- All components fetch and display real data

## Access & Security

- Role-based access, data sensitivity filtering
- Audit trails for dashboard usage
- No public endpoints; all API keys managed securely
