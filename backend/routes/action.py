from flask import Blueprint, request, jsonify
from firebase_client import get_db

action_bp = Blueprint('action', __name__)

@action_bp.route('/action/update', methods=['POST'])
def update_action():
    try:
        body = request.get_json()
        founder_id = body.get('founder_id', 'demo-founder-001')
        action_id = body.get('action_id')
        status = body.get('status') # 'seen', 'ignored', 'completed'
        
        if not action_id or not status:
            return jsonify({"success": False, "message": "Missing action_id or status"}), 400
            
        db = get_db()
        doc_ref = db.collection('actions').document(founder_id)
        doc = doc_ref.get()
        
        data = doc.to_dict() if doc.exists else {'seen': [], 'ignored': [], 'completed': []}
        
        # Add to the specific list
        if action_id not in data.get(status, []):
            data[status].append(action_id)
            doc_ref.set(data)
            
        return jsonify({"success": True, "message": f"Action marked as {status}"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400
