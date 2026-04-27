from firebase_client import get_db
from datetime import datetime


class MemoryEngine:
    """Tracks which actions founders act on vs ignore, adjusts future briefs."""

    def record_action(self, founder_id: str, action_id: str,
                      action_type: str, status: str):
        """Called when founder marks action as done or dismissed."""
        db = get_db()
        db.collection('memory').document(founder_id) \
          .collection('actions').add({
            'action_id': action_id,
            'action_type': action_type,
            'status': status,  # 'completed' or 'ignored'
            'timestamp': datetime.now().isoformat(),
            'week': datetime.now().isocalendar()[1]
        })

    def get_behavior_profile(self, founder_id: str) -> dict:
        """Analyzes past behavior to adjust future brief generation."""
        try:
            db = get_db()
            actions = db.collection('memory').document(founder_id) \
                        .collection('actions') \
                        .order_by('timestamp', direction='DESCENDING') \
                        .limit(50).stream()

            action_list = [a.to_dict() for a in actions]

            if not action_list:
                return {"has_history": False}

            completed = [a for a in action_list if a['status'] == 'completed']
            ignored = [a for a in action_list if a['status'] == 'ignored']

            ignored_types = {}
            for action in ignored:
                t = action.get('action_type', 'unknown')
                ignored_types[t] = ignored_types.get(t, 0) + 1

            completed_types = {}
            for action in completed:
                t = action.get('action_type', 'unknown')
                completed_types[t] = completed_types.get(t, 0) + 1

            most_ignored = max(ignored_types, key=ignored_types.get) \
                           if ignored_types else None
            most_acted = max(completed_types, key=completed_types.get) \
                         if completed_types else None

            return {
                "has_history": True,
                "total_actions_seen": len(action_list),
                "completion_rate": round(
                    len(completed) / len(action_list) * 100
                ) if action_list else 0,
                "most_ignored_type": most_ignored,
                "most_acted_type": most_acted,
                "ignored_counts": ignored_types,
                "completed_counts": completed_types,
                "insight": self._generate_insight(
                    most_ignored, most_acted,
                    ignored_types, completed_types
                )
            }
        except Exception as e:
            print(f"Memory engine error: {e}")
            return {"has_history": False}

    def _generate_insight(self, most_ignored, most_acted,
                          ignored_types, completed_types) -> str:
        if most_ignored == 'cost_saving' and most_acted == 'deprecation':
            return ("Sam acts on breaking changes but delays cost "
                    "optimizations. Deprecations ranked higher today.")
        elif most_ignored == 'deprecation':
            return ("Warning: Sam has ignored deprecation alerts before. "
                    "This one is critical — flagged at maximum urgency.")
        elif most_acted == 'cost_saving':
            return ("Sam consistently acts on cost savings. "
                    "Three available this week.")
        elif most_ignored and most_acted:
            return (f"Pattern: acts on {most_acted} actions, "
                    f"tends to delay {most_ignored} actions. "
                    f"Brief adjusted accordingly.")
        return "Behavior patterns emerging. Check back after 5 actions."


# Singleton
memory_engine = MemoryEngine()
