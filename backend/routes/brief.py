from flask import Blueprint, request, jsonify
from firebase_client import get_db
from ai.gemini import generate_brief
from ai.memory import memory_engine
from utils.calculator import RunwayCalculator
from datetime import datetime

brief_bp = Blueprint('brief', __name__)
calc = RunwayCalculator()


def success(data, message=""):
    return jsonify({"success": True, "data": data, "message": message})


def error(message, code=400):
    return jsonify({"success": False, "data": {}, "message": message}), code


@brief_bp.route('/brief/generate', methods=['POST'])
def generate():
    try:
        body = request.get_json()
        founder_id = body.get('founder_id', 'demo-founder-001')
        db = get_db()

        # Load stack profile
        stack_doc = db.collection('stacks').document(founder_id).get()
        if not stack_doc.exists:
            return error(
                "Stack not registered yet. Please register your stack first.",
                404
            )

        stack_data = stack_doc.to_dict()
        stack_profile = stack_data.get('stack', {})
        stack_profile['burn_rate'] = stack_data.get('burn_rate', 18000)
        stack_profile['total_monthly_cost'] = stack_profile.get(
            'total_monthly_cost', calc._sum_costs(stack_profile)
        )

        # Load memory/behavior profile
        behavior_profile = memory_engine.get_behavior_profile(founder_id)

        # Generate brief with memory context
        brief = generate_brief(stack_profile, behavior_profile)
        brief['date'] = datetime.utcnow().isoformat()
        brief['founder_id'] = founder_id

        # Include memory metadata in response
        if behavior_profile.get('has_history'):
            brief['memory_active'] = True
            brief['memory_summary'] = (
                f"Adjusted based on {behavior_profile['total_actions_seen']} "
                f"past actions"
            )
            if not brief.get('memory_insight'):
                brief['memory_insight'] = behavior_profile.get('insight', '')
        else:
            brief['memory_active'] = False

        # Save to history
        db.collection('briefs').document(founder_id).collection('history') \
          .document(datetime.utcnow().strftime('%Y-%m-%d-%H%M')).set(brief)

        return success(brief)
    except Exception as e:
        return error(str(e))


@brief_bp.route('/brief/history/<founder_id>', methods=['GET'])
def get_history(founder_id):
    try:
        db = get_db()
        docs = db.collection('briefs').document(founder_id) \
                 .collection('history') \
                 .order_by('date', direction='DESCENDING') \
                 .limit(10).stream()
        briefs = [doc.to_dict() for doc in docs]
        return success({"briefs": briefs})
    except Exception as e:
        return error(str(e))
