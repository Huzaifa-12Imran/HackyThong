from flask import Blueprint, request, jsonify
from firebase_client import get_db
from ai.gemini import analyze_cost_impact
from utils.calculator import RunwayCalculator

analyze_bp = Blueprint('analyze', __name__)
calc = RunwayCalculator()


def success(data, message=""):
    return jsonify({"success": True, "data": data, "message": message})


def error(message, code=400):
    return jsonify({"success": False, "data": {}, "message": message}), code


@analyze_bp.route('/analyze/cost-impact', methods=['POST'])
def cost_impact():
    try:
        body = request.get_json()
        founder_id = body.get('founder_id', 'demo-founder-001')
        change = body.get('change', '')
        if not change:
            return error("Please provide a change description")

        db = get_db()
        stack_doc = db.collection('stacks').document(founder_id).get()
        stack_data = stack_doc.to_dict() if stack_doc.exists else {}

        stack_profile = stack_data.get('stack', {})
        burn_rate = stack_data.get('burn_rate', 18000)
        stack_profile['burn_rate'] = burn_rate
        stack_profile['total_monthly_cost'] = stack_profile.get(
            'total_monthly_cost', calc._sum_costs(stack_profile)
        )

        result = analyze_cost_impact(stack_profile, change, burn_rate)
        return success(result)
    except Exception as e:
        return error(str(e))
