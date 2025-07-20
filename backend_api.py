# Backend API for Dashboard Live Data
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

API_TOKENS = {
    'admin': 'admin-token-123',
    'manager': 'manager-token-456',
    'viewer': 'viewer-token-789',
}

def require_role(roles):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not any(token == API_TOKENS[role] for role in roles):
                abort(403)
            return fn(*args, **kwargs)
        wrapper.__name__ = fn.__name__
        return wrapper
    return decorator


@app.route('/api/metrics/summary')
def metrics_summary():
    return jsonify({
        'summary': {
            'revenue': random.randint(10000, 20000),
            'expenses': random.randint(7000, 12000),
            'profit': random.randint(3000, 8000)
        },
        'trend': {
            'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            'revenue': [random.randint(10000, 20000) for _ in range(6)],
            'expenses': [random.randint(7000, 12000) for _ in range(6)]
        }
    })


# Agent Health endpoint for AgentHealthDashboard
@app.route('/api/metrics/agent-health')
def agent_health():
    return jsonify({
        'summary': {
            'healthy': random.randint(15, 20),
            'warnings': random.randint(0, 3),
            'errors': random.randint(0, 2)
        },
        'trend': [random.randint(15, 20) for _ in range(7)]
    })

# Executive Dashboard endpoint
@app.route('/api/metrics/executive')
def executive_metrics():
    return jsonify({
        'kpis': {
            'growth': random.uniform(2.0, 8.0),
            'customer_satisfaction': random.uniform(80, 100),
            'market_share': random.uniform(10, 30)
        }
    })

# Financial Dashboard endpoint
@app.route('/api/metrics/financial')
def financial_metrics():
    return jsonify({
        'summary': {
            'revenue': random.randint(10000, 20000),
            'expenses': random.randint(7000, 12000),
            'profit': random.randint(3000, 8000)
        },
        'trend': {
            'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            'revenue': [random.randint(10000, 20000) for _ in range(6)],
            'expenses': [random.randint(7000, 12000) for _ in range(6)]
        }
    })

# Operations Dashboard endpoint
@app.route('/api/metrics/operations')
def operations_metrics():
    return jsonify({
        'tasks_completed': random.randint(80, 120),
        'tasks_pending': random.randint(5, 20),
        'efficiency': random.uniform(85, 99)
    })

# Marketing Dashboard endpoint
@app.route('/api/metrics/marketing')
def marketing_metrics():
    return jsonify({
        'campaigns': random.randint(2, 8),
        'leads': random.randint(100, 300),
        'conversion_rate': random.uniform(2.0, 7.0)
    })

# Compliance Dashboard endpoint
@app.route('/api/metrics/compliance')
def compliance_metrics():
    return jsonify({
        'audits_passed': random.randint(5, 10),
        'audits_failed': random.randint(0, 2),
        'compliance_score': random.uniform(90, 100)
    })


@app.route('/api/metrics/executive')
def metrics_executive():
    return jsonify({
        'summary': {
            'revenue': random.randint(4000, 5000),
            'agents': random.randint(15, 22),
            'status': 'Operational'
        },
        'trend': [random.randint(4000, 5000) for _ in range(7)]
    })


@app.route('/api/metrics/financial')
def metrics_financial():
    return jsonify({
        'summary': {
            'y1': random.randint(40000, 60000),
            'margin': random.randint(70, 95),
            'pipeline': random.randint(60000, 90000)
        },
        'pipeline': [random.randint(60000, 90000) for _ in range(4)]
    })


@app.route('/api/metrics/operations')
@require_role(['admin', 'manager'])
def metrics_operations():
    return jsonify({
        'summary': {
            'workflows': random.randint(5, 10),
            'bi_reports': random.randint(10, 20),
            'agent_health': random.choice(['Healthy', 'Degraded', 'Critical'])
        },
        'trend': [random.randint(5, 10) for _ in range(7)]
    })


@app.route('/api/metrics/marketing')
@require_role(['admin', 'manager', 'viewer'])
def metrics_marketing():
    return jsonify({
        'summary': {
            'leads': random.randint(100, 200),
            'campaigns': random.randint(3, 8),
            'conversion': round(random.uniform(5, 10), 2)
        },
        'trend': [random.randint(80, 200) for _ in range(7)]
    })


@app.route('/api/metrics/agent-health')
@require_role(['admin', 'manager'])
def metrics_agent_health():
    return jsonify({
        'summary': {
            'healthy': random.randint(15, 20),
            'errors': random.randint(0, 2),
            'warnings': random.randint(0, 5)
        },
        'trend': [random.randint(15, 20) for _ in range(7)]
    })


@app.route('/api/metrics/compliance')
@require_role(['admin', 'manager', 'viewer'])
def metrics_compliance():
    return jsonify({
        'summary': {
            'status': random.choice(['Compliant', 'Non-Compliant']),
            'audit_findings': random.randint(0, 2),
            'risk_level': random.choice(['Low', 'Medium', 'High'])
        },
        'trend': [random.choice(['Low', 'Medium', 'High']) for _ in range(7)]
    })

# ...existing code...


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)
