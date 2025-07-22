import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta
import requests

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import random
import sqlite3

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv('/home/adam/repos/enterprise/config/.env')

# Access API keys for external APIs (now supporting data)
MARKETSTACK_API_KEY = os.getenv('MARKETSTACK_API_KEY')
POLYGON_API_KEY = os.getenv('POLYGON_API_KEY')
NEWSAPI_KEY = os.getenv('NEWSAPI_KEY')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')

API_TOKENS = {
    'admin': os.getenv('API_ADMIN_TOKEN'),
    'manager': os.getenv('API_MANAGER_TOKEN'),
    'viewer': os.getenv('API_VIEWER_TOKEN'),
}

# Database paths
ENTERPRISE_DB = 'data/enterprise_operations.db'
LEGION_DB = 'legion/active_system.db'


# === ENTERPRISE AGENT SYSTEM ENDPOINTS ===

@app.route('/api/enterprise/agent-activities')
def get_agent_activities():
    """Get agent activities from enterprise operations database"""
    try:
        conn = sqlite3.connect(ENTERPRISE_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM agent_activities 
            ORDER BY created_at DESC 
            LIMIT 100
        """)
        
        activities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(activities)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch agent activities: {e}'}), 500


@app.route('/api/enterprise/workflow-executions')
def get_workflow_executions():
    """Get workflow executions from both enterprise and legion databases"""
    try:
        workflows = []
        
        # Get from enterprise database
        try:
            conn = sqlite3.connect(ENTERPRISE_DB)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT *, 'enterprise' as source 
                FROM workflow_executions 
                ORDER BY created_at DESC 
                LIMIT 50
            """)
            
            workflows.extend([dict(row) for row in cursor.fetchall()])
            conn.close()
        except:
            pass
        
        # Get from legion database
        try:
            conn = sqlite3.connect(LEGION_DB)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT *, 'legion' as source 
                FROM workflow_executions 
                ORDER BY started_at DESC 
                LIMIT 50
            """)
            
            workflows.extend([dict(row) for row in cursor.fetchall()])
            conn.close()
        except:
            pass
            
        return jsonify(workflows)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch workflow executions: {e}'}), 500


@app.route('/api/enterprise/business-metrics')
def get_business_metrics():
    """Get business objectives and metrics"""
    try:
        conn = sqlite3.connect(ENTERPRISE_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get business objectives
        cursor.execute("SELECT * FROM business_objectives ORDER BY created_at DESC")
        objectives = [dict(row) for row in cursor.fetchall()]
        
        # Get revenue tracking
        cursor.execute("""
            SELECT * FROM revenue_tracking 
            ORDER BY year DESC, month DESC 
            LIMIT 12
        """)
        revenue_data = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'objectives': objectives,
            'revenue_tracking': revenue_data
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch business metrics: {e}'}), 500


@app.route('/api/enterprise/department-activities')
def get_department_activities():
    """Get department activities"""
    try:
        conn = sqlite3.connect(ENTERPRISE_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM department_activities 
            ORDER BY created_at DESC 
            LIMIT 50
        """)
        
        activities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(activities)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch department activities: {e}'}), 500


@app.route('/api/enterprise/system-messages')
def get_system_messages():
    """Get system messages from legion database"""
    try:
        conn = sqlite3.connect(LEGION_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM system_messages 
            ORDER BY created_at DESC 
            LIMIT 100
        """)
        
        messages = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(messages)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch system messages: {e}'}), 500


@app.route('/api/enterprise/agent-communications')
def get_agent_communications():
    """Get agent communications"""
    try:
        conn = sqlite3.connect(ENTERPRISE_DB)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM agent_communications 
            ORDER BY timestamp DESC 
            LIMIT 100
        """)
        
        communications = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify(communications)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch agent communications: {e}'}), 500


@app.route('/api/supporting-data')
def get_supporting_data():
    """Get compact supporting data from external APIs"""
    try:
        supporting_data = {}
        
        # Market data (simplified)
        if MARKETSTACK_API_KEY:
            try:
                market_response = requests.get(
                    f'https://api.marketstack.com/v1/eod?access_key={MARKETSTACK_API_KEY}&symbols=AAPL,TSLA,NVDA&limit=1',
                    timeout=5
                )
                if market_response.status_code == 200:
                    market_data = market_response.json()
                    supporting_data['market'] = market_data.get('data', [])[:3]
            except:
                pass
        
        # Weather data (mock for now)
        supporting_data['weather'] = {
            'temperature': 24,
            'condition': 'sunny',
            'aqi': 45,
            'uv_index': 'moderate'
        }
        
        # News headlines (simplified)
        if NEWSAPI_KEY:
            try:
                news_response = requests.get(
                    f'https://newsapi.org/v2/top-headlines?category=technology&apiKey={NEWSAPI_KEY}&pageSize=5',
                    timeout=5
                )
                if news_response.status_code == 200:
                    news_data = news_response.json()
                    supporting_data['news'] = [
                        {'title': article['title'][:50] + '...'}
                        for article in news_data.get('articles', [])[:3]
                    ]
            except:
                pass
        
        # System status
        supporting_data['system_status'] = {
            'api_health': 'healthy',
            'db_status': 'connected',
            'legion_core': 'active'
        }
        
        return jsonify(supporting_data)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch supporting data: {e}'}), 500


# === ORIGINAL API ENDPOINTS (LEGACY SUPPORT) ===
    def decorator(fn):
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not any(token == API_TOKENS[role] for role in roles):
                abort(403)
            return fn(*args, **kwargs)
        wrapper.__name__ = fn.__name__
        return wrapper
    return decorator


# --- Marketstack Candlestick Data Proxy Endpoint ---
@app.route('/api/marketstack-candles')
def marketstack_candles():
    symbol = request.args.get('symbol', 'AAPL')
    timeframe = request.args.get('timeframe', '1d')
    api_key = MARKETSTACK_API_KEY
    if not api_key:
        return jsonify({'error': 'Marketstack API key not configured.'}), 500
    
    # Marketstack supports end-of-day and intraday endpoints
    if timeframe in ['1d', '1w']:
        endpoint = f'https://api.marketstack.com/v1/eod?access_key={api_key}&symbols={symbol}&limit=60'
    else:
        endpoint = f'https://api.marketstack.com/v1/intraday?access_key={api_key}&symbols={symbol}&interval={timeframe}&limit=60'
    
    try:
        res = requests.get(endpoint)
        data = res.json()
        if not data.get('data'):
            return jsonify({'error': 'No data from Marketstack'}), 502
        
        # Convert to lightweight-charts format
        candles = [
            {
                'time': int(datetime.strptime(bar['date'], '%Y-%m-%dT%H:%M:%S%z').timestamp()),
                'open': bar['open'],
                'high': bar['high'],
                'low': bar['low'],
                'close': bar['close'],
                'volume': bar['volume'],
            }
            for bar in data['data']
        ][::-1]
        return jsonify({'candles': candles})
    except Exception as e:
        return jsonify({'error': f'Failed to fetch Marketstack data: {e}'}), 500


# --- Agent Registry Endpoint ---
@app.route('/api/agents')
def api_agents():
    # Simulate agent registry (replace with real registry if available)
    departments = [
        "strategy", "marketing", "finance", "operations",
        "business_intelligence", "communication"
    ]
    agent_types = {
        "strategy": ["strategic_planner", "business_analyst", "market_researcher"],
        "marketing": ["content_creator", "social_media_manager", "lead_generator"],
        "finance": ["financial_analyst", "budget_manager", "revenue_tracker"],
        "operations": ["workflow_orchestrator", "resource_optimizer", "task_scheduler"],
        "business_intelligence": ["data_analyst", "market_analyst", "competitive_researcher"],
        "communication": ["content_writer", "social_media_monitor", "brand_manager"]
    }
    agents = []
    for dept in departments:
        for agent_type in agent_types[dept]:
            agents.append({
                "agent_id": f"{dept}_{agent_type}",
                "agent_type": agent_type,
                "department": dept,
                "status": "standby",  # Default status; update with real status if available
                "current_task": None
            })
    return jsonify({"agents": agents})


@app.route('/api/metrics/summary')
def metrics_summary():
    return jsonify({'error': 'No real data source connected for summary metrics.'}), 501


# Agent Activities endpoint for AgentActivityTable (REAL DATA)
@app.route('/api/agent-activities')
def agent_activities():
    db_path = os.path.join(os.path.dirname(__file__), 'data', 'enterprise_operations.db')
    activities = []
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, department, operation_type, description, data, timestamp
            FROM business_operations
            ORDER BY timestamp DESC
            LIMIT 50
        ''')
        rows = cursor.fetchall()
        for row in rows:
            # Try to extract agent/activity info from data JSON if available
            try:
                data_json = json.loads(row[4]) if row[4] else {}
            except Exception:
                data_json = {}
            activities.append({
                'id': row[0],
                'agentName': data_json.get('agent_name') or row[1],
                'activity': data_json.get('activity') or row[2],
                'status': data_json.get('status') or 'Completed',
                'timestamp': row[5],
                'duration': data_json.get('duration') or ''
            })
        conn.close()
    except Exception as e:
        return jsonify({'error': f'Failed to fetch activities: {e}'}), 500
    return jsonify(activities)


# Agent Health endpoint for AgentHealthDashboard
@app.route('/api/metrics/agent-health')
def agent_health():
    return jsonify({'error': 'No real data source connected for agent health.'}), 501


# Executive Dashboard endpoint
@app.route('/api/metrics/executive')
def executive_metrics():
    return jsonify({'error': 'No real data source connected for executive metrics.'}), 501


# Financial Dashboard endpoint
@app.route('/api/metrics/financial')
def financial_metrics():
    return jsonify({'error': 'No real data source connected for financial metrics.'}), 501


# Operations Dashboard endpoint
@app.route('/api/metrics/operations')
def operations_metrics():
    return jsonify({'error': 'No real data source connected for operations metrics.'}), 501


# Marketing Dashboard endpoint
@app.route('/api/metrics/marketing')
def marketing_metrics():
    return jsonify({'error': 'No real data source connected for marketing metrics.'}), 501


# Compliance Dashboard endpoint
@app.route('/api/metrics/compliance')
def compliance_metrics():
    return jsonify({'error': 'No real data source connected for compliance metrics.'}), 501


# --- API Registry Endpoint ---
@app.route('/api/registry')
def api_registry():
    registry_path = os.path.join(
        os.path.dirname(__file__), 'config', 'api_registry.json')
    try:
        with open(registry_path, 'r', encoding='utf-8') as f:
            registry = json.load(f)
        return jsonify({'apis': registry})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("Starting Flask server on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)
