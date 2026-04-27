from flask import Blueprint, request, jsonify
from firebase_client import get_db
from ai.gemini import analyze_cost_impact

analyze_bp = Blueprint('analyze', __name__)

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
        stack_profile = stack_doc.to_dict() if stack_doc.exists else {}
        result = analyze_cost_impact(stack_profile, change)
        return success(result)
    except Exception as e:
        return error(str(e))
