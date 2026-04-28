from flask import Blueprint, request, jsonify
from ai.gemini import (
    analyze_reality_gap,
    translate_to_paul,
    infer_competitor_margin,
    calculate_blast_radius
)

features_bp = Blueprint('features', __name__, url_prefix='/features')

@features_bp.route('/reality-check', methods=['POST'])
def reality_check():
    data = request.json
    promise = data.get('promise', '')
    reality = data.get('reality', '')
    
    if not promise or not reality:
        return jsonify({"success": False, "message": "Missing promise or reality"}), 400
        
    result = analyze_reality_gap(promise, reality)
    return jsonify({"success": True, "data": result})


@features_bp.route('/paul-translation', methods=['POST'])
def paul_translation():
    data = request.json
    tech_update = data.get('tech_update', '')
    
    if not tech_update:
        return jsonify({"success": False, "message": "Missing tech update"}), 400
        
    result = translate_to_paul(tech_update)
    return jsonify({"success": True, "data": result})


@features_bp.route('/margin-spy', methods=['POST'])
def margin_spy():
    data = request.json
    competitor = data.get('competitor', '')
    user_stack = data.get('user_stack', 'Gemini 2.5 Flash, Cloud Run, Firebase') # Default if not provided
    
    if not competitor:
        return jsonify({"success": False, "message": "Missing competitor name"}), 400
        
    result = infer_competitor_margin(competitor, user_stack)
    return jsonify({"success": True, "data": result})


@features_bp.route('/blast-radius', methods=['POST'])
def blast_radius():
    data = request.json
    deprecation = data.get('deprecation', '')
    
    if not deprecation:
        return jsonify({"success": False, "message": "Missing deprecation info"}), 400
        
    result = calculate_blast_radius(deprecation)
    return jsonify({"success": True, "data": result})
