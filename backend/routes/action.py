from flask import Blueprint, request, jsonify
from firebase_client import get_db
from ai.memory import memory_engine

action_bp = Blueprint('action', __name__)


def success(data, message=""):
    return jsonify({"success": True, "data": data, "message": message})


def error(message, code=400):
    return jsonify({"success": False, "data": {}, "message": message}), code


@action_bp.route('/action/update', methods=['POST'])
def update_action():
    """Record an action as completed or ignored — feeds the Memory Engine."""
    try:
        body = request.get_json()
        founder_id = body.get('founder_id', 'demo-founder-001')
        action_id = body.get('action_id')
        action_type = body.get('action_type', 'opportunity')
        status = body.get('status')  # 'completed' or 'ignored'

        if not action_id or not status:
            return error("Missing action_id or status")

        if status not in ('completed', 'ignored'):
            return error("Status must be 'completed' or 'ignored'")

        # Record in the Memory Engine (subcollection for behavior tracking)
        memory_engine.record_action(
            founder_id=founder_id,
            action_id=action_id,
            action_type=action_type,
            status=status
        )

        # Also update the simple tracking doc for quick lookups
        db = get_db()
        doc_ref = db.collection('actions').document(founder_id)
        doc = doc_ref.get()
        data = doc.to_dict() if doc.exists else {
            'completed': [], 'ignored': []
        }

        if action_id not in data.get(status, []):
            if status not in data:
                data[status] = []
            data[status].append(action_id)
            doc_ref.set(data)

        return success(
            {"status": status, "action_id": action_id},
            f"Action marked as {status}"
        )
    except Exception as e:
        return error(str(e))


@action_bp.route('/action/memory/<founder_id>', methods=['GET'])
def get_memory(founder_id):
    """Get the founder's behavior profile from the Memory Engine."""
    try:
        profile = memory_engine.get_behavior_profile(founder_id)
        return success(profile)
    except Exception as e:
        return error(str(e))
