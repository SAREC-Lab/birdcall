
import multiprocessing as mp
from flask import Flask, request, jsonify
import dronekit_sitl
from dronekit import connect, VehicleMode

from drone_commands import arm_and_takeoff

app = Flask(__name__)
    

def drone_handler(connection):

    #initialize the drone
    sitl = dronekit_sitl.start_default()
    connection_string = sitl.connection_string()
    vehicle = connect(connection_string, wait_ready=True)

    while True:
        if connection.poll():
            msg = connection.recv()

            if msg == 'takeoff':
                arm_and_takeoff(vehicle, 20)
                



conn, child_conn = mp.Pipe()
drone_process = mp.Process(target=drone_handler, args=(child_conn, ))
drone_process.start()

@app.route('/', methods=['POST'])
def command():
    if request.method == 'POST':
        data = request.get_json()
        try:
            message = data['message']
            conn.send(message)
            return jsonify(success=True)
        except KeyError:
            #send error message?
            return jsonify(success=False)

    return jsonify(success=False)




