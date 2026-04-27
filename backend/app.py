from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

from routes.stack import stack_bp
from routes.brief import brief_bp
from routes.analyze import analyze_bp
from routes.action import action_bp
from routes.chat import chat_bp

app.register_blueprint(stack_bp)
app.register_blueprint(brief_bp)
app.register_blueprint(analyze_bp)
app.register_blueprint(action_bp)
app.register_blueprint(chat_bp)

@app.route('/health')
def health():
    return jsonify({"success": True, "data": {"status": "ok"}, "message": ""})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
