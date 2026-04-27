from flask import Blueprint, jsonify
from firebase_client import get_db
from utils.calculator import RunwayCalculator
from ai.gemini import generate_health_analysis

health_bp = Blueprint('health', __name__)
calc = RunwayCalculator()


def success(data, message=""):
    return jsonify({"success": True, "data": data, "message": message})


def error(message, code=400):
    return jsonify({"success": False, "data": {}, "message": message}), code


@health_bp.route('/health/detailed/<founder_id>', methods=['GET'])
def detailed_health(founder_id):
    """Dedicated health score with full explanation — calculator does the math."""
    try:
        db = get_db()
        stack_doc = db.collection('stacks').document(founder_id).get()
        if not stack_doc.exists:
            return error("Stack not found", 404)

        stack_data = stack_doc.to_dict()
        stack_profile = stack_data.get('stack', {})
        stack_profile['burn_rate'] = stack_data.get('burn_rate', 18000)
        stack_profile['total_monthly_cost'] = stack_profile.get(
            'total_monthly_cost', calc._sum_costs(stack_profile)
        )

        # Get AI analysis for context (issues list)
        ai_analysis = generate_health_analysis(stack_profile)
        issues = ai_analysis.get('issues', [])

        # Python calculates the actual score — never Gemini
        health = calc.calculate_health_score(stack_profile, issues)

        return success({
            "health_score": health['score'],
            "health_grade": health['grade'],
            "health_explanation": health['explanation'],
            "top_risk": ai_analysis.get('top_risk', 'No immediate risks detected'),
            "breakdown": ai_analysis.get('breakdown', {}),
            "total_monthly_cost": stack_profile['total_monthly_cost'],
            "burn_rate": stack_profile['burn_rate']
        })
    except Exception as e:
        return error(str(e))
