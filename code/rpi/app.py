from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['POST'])
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
