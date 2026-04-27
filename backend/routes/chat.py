from flask import Blueprint, request, jsonify
from firebase_client import get_db
from ai.gemini import get_chat_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        body = request.get_json()
        founder_id = body.get('founder_id', 'demo-founder-001')
        question = body.get('question')
        
        if not question:
            return jsonify({"success": False, "message": "What is your question?"}), 400
            
        db = get_db()
        stack_doc = db.collection('stacks').document(founder_id).get()
        stack = stack_doc.to_dict().get('stack', {}) if stack_doc.exists else {}
        
        result = get_chat_response(stack, question)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400
