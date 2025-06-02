def success(jsonify, data, status_code=200):
    return jsonify({ 'success': True, 'data': data }), status_code

def error(jsonify, message, status_code=500):
    return jsonify({ 'success': False, 'error': message }), status_code