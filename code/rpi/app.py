from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/commands', methods=['POST'])
def command():
    if request.method == 'POST':
        print(request.get_json())
        return jsonify(success=True)

    return jsonify(success=False)


@app.route('/waypoints', methods=['POST'])
def waypoints():
    if request.method == 'POST':
        print(request.get_json())
        return jsonify(success=True)

    return jsonify(success=False)

count = 0
@app.route('/status', methods=['GET'])
def status():
    if request.method == 'GET':
        global count
        count += 1
        return jsonify({'ready': count > 5})

    return jsonify(ready=False)
