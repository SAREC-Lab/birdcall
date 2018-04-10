
import multiprocessing as mp
from flask import Flask, request, jsonify

app = Flask(__name__)
    

def drone_handler(connection):

    while True:
        if connection.poll():
            print(connection.recv())


conn, child_conn = mp.Pipe()
drone_process = mp.Process(target=drone_handler, args=(child_conn, ))
drone_process.start()

@app.route('/', methods=['POST'])
def command():
    if request.method == 'POST':
        data = request.get_json()
        try:
            message = data['message']
            conn.send('message')
            return jsonify(success=True)
        except KeyError:
            #send error message?
            return jsonify(success=False)

    return jsonify(success=False)




