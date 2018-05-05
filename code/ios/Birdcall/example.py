from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/status', methods=['GET'])
def landing():
    if request.method == 'GET':
        return jsonify({'ready': True})

