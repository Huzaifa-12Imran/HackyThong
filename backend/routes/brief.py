from flask import Blueprint, request, jsonify
from firebase_client import get_db
from ai.gemini import generate_brief
from datetime import datetime

brief_bp = Blueprint('brief', __name__)

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
        stack_doc = db.collection('stacks').document(founder_id).get()
        if not stack_doc.exists:
            return error("Stack not registered yet. Please register your stack first.", 404)
        stack_profile = stack_doc.to_dict()
        brief = generate_brief(stack_profile)
        brief['date'] = datetime.utcnow().isoformat()
        brief['founder_id'] = founder_id
        db.collection('briefs').document(founder_id).collection('history').document(
            datetime.utcnow().strftime('%Y-%m-%d')
        ).set(brief)
        return success(brief)
    except Exception as e:
        return error(str(e))

@brief_bp.route('/brief/history/<founder_id>', methods=['GET'])
def get_history(founder_id):
    try:
        db = get_db()
        docs = db.collection('briefs').document(founder_id).collection('history').order_by(
            'date', direction='DESCENDING'
        ).limit(10).stream()
        briefs = [doc.to_dict() for doc in docs]
        return success({"briefs": briefs})
    except Exception as e:
        return error(str(e))
