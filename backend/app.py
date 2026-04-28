from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Add backend directory to path so imports work correctly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

app = Flask(__name__)
CORS(app)

from routes.stack import stack_bp
from routes.brief import brief_bp
from routes.analyze import analyze_bp
from routes.action import action_bp
from routes.chat import chat_bp
from routes.health import health_bp

app.register_blueprint(stack_bp)
app.register_blueprint(brief_bp)
app.register_blueprint(analyze_bp)
app.register_blueprint(action_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(health_bp)


@app.route('/health')
def health():
    return jsonify({"success": True, "data": {"status": "ok"}, "message": ""})


@app.route('/cache/clear', methods=['GET', 'POST'])
def clear_cache():
    """Flush the in-memory response cache (call between demo runs)."""
    from utils.cache import response_cache
    response_cache.clear()
    return jsonify({"success": True, "message": "Cache cleared"})


@app.route('/seed-demo', methods=['POST'])
def seed_demo():
    """One-click endpoint to seed all demo data into Firestore."""
    try:
        from firebase_client import get_db
        from datetime import datetime, timedelta
        db = get_db()

        # 1. Seed the demo stack profile
        demo_stack = {
            "founder_id": "demo-founder-001",
            "burn_rate": 18000,
            "registered_at": datetime.utcnow().isoformat(),
            "stack": {
                "models": [
                    {"name": "gemini-2.5-flash", "monthly_cost": 420},
                    {"name": "text-embedding-004", "monthly_cost": 80}
                ],
                "infrastructure": [
                    {"name": "Cloud Run", "monthly_cost": 340},
                    {"name": "Firebase Firestore", "monthly_cost": 60}
                ],
                "saas_tools": [
                    {"name": "Pinecone", "monthly_cost": 200},
                    {"name": "Resend", "monthly_cost": 50}
                ],
                "total_monthly_cost": 1150
            }
        }
        db.collection('stacks').document('demo-founder-001').set(demo_stack)

        # 2. Seed 8 historical memory actions for behavior profile
        now = datetime.now()
        memory_actions = [
            {"action_type": "cost_saving", "status": "ignored",
             "timestamp": (now - timedelta(weeks=3)).isoformat(),
             "action_id": "hist-001", "week": (now - timedelta(weeks=3)).isocalendar()[1]},
            {"action_type": "cost_saving", "status": "ignored",
             "timestamp": (now - timedelta(weeks=2)).isoformat(),
             "action_id": "hist-002", "week": (now - timedelta(weeks=2)).isocalendar()[1]},
            {"action_type": "deprecation", "status": "completed",
             "timestamp": (now - timedelta(weeks=2, days=-1)).isoformat(),
             "action_id": "hist-003", "week": (now - timedelta(weeks=2, days=-1)).isocalendar()[1]},
            {"action_type": "opportunity", "status": "ignored",
             "timestamp": (now - timedelta(days=10)).isoformat(),
             "action_id": "hist-004", "week": (now - timedelta(days=10)).isocalendar()[1]},
            {"action_type": "deprecation", "status": "completed",
             "timestamp": (now - timedelta(days=8)).isoformat(),
             "action_id": "hist-005", "week": (now - timedelta(days=8)).isocalendar()[1]},
            {"action_type": "cost_saving", "status": "ignored",
             "timestamp": (now - timedelta(days=5)).isoformat(),
             "action_id": "hist-006", "week": (now - timedelta(days=5)).isocalendar()[1]},
            {"action_type": "deprecation", "status": "completed",
             "timestamp": (now - timedelta(days=3)).isoformat(),
             "action_id": "hist-007", "week": (now - timedelta(days=3)).isocalendar()[1]},
            {"action_type": "opportunity", "status": "completed",
             "timestamp": (now - timedelta(days=1)).isoformat(),
             "action_id": "hist-008", "week": (now - timedelta(days=1)).isocalendar()[1]},
        ]

        mem_ref = db.collection('memory').document('demo-founder-001') \
                    .collection('actions')
        for action in memory_actions:
            mem_ref.add(action)

        return jsonify({
            "success": True,
            "data": {
                "stack_seeded": True,
                "memory_actions_seeded": len(memory_actions),
                "founder_id": "demo-founder-001"
            },
            "message": "Demo data seeded successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
