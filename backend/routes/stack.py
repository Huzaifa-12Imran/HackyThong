from flask import Blueprint, request, jsonify
from firebase_client import get_db
from datetime import datetime

stack_bp = Blueprint('stack', __name__)

def success(data, message=""):
    return jsonify({"success": True, "data": data, "message": message})

def error(message, code=400):
    return jsonify({"success": False, "data": {}, "message": message}), code

@stack_bp.route('/stack/register', methods=['POST'])
def register_stack():
    try:
        body = request.get_json()
        founder_id = body.get('founder_id', 'demo-founder-001')
        stack = body.get('stack', {})
        db = get_db()
        db.collection('stacks').document(founder_id).set({
            'stack': stack,
            'registered_at': datetime.utcnow().isoformat(),
            'founder_id': founder_id
        })
        return success({"stack_id": founder_id}, "Stack registered successfully")
    except Exception as e:
        return error(str(e))

@stack_bp.route('/stack/<founder_id>', methods=['GET'])
def get_stack(founder_id):
    try:
        db = get_db()
        doc = db.collection('stacks').document(founder_id).get()
        if not doc.exists:
            return error("Stack not found", 404)
        return success(doc.to_dict())
    except Exception as e:
        return error(str(e))
