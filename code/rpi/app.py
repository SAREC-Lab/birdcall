
import multiprocessing as mp
from flask import Flask, request, jsonify
import dronekit_sitl
from dronekit import connect, VehicleMode

from drone_commands import *

app = Flask(__name__)
    

def parse_message(msg, vehicle, waypoints):

    spl = msg.split()

    if spl[0] == 'takeoff':
        success = arm_and_takeoff(vehicle, spl)

    elif spl[0] == 'go':
        success = goto(vehicle, spl, waypoints)
    
    return success


def drone_handler(connection):

    #initialize the drone
    sitl = dronekit_sitl.start_default()
    connection_string = sitl.connection_string()
    vehicle = connect(connection_string, wait_ready=True)

    waypoints = {}

    while True:
        print(vehicle.location.global_relative_frame)
        if connection.poll():
            data = connection.recv()
            success = False

            if isinstance(data, dict):

                if data['type'] == 'command':
                    msg = data['message']
                    success = parse_message(msg, vehicle, waypoints)

                elif data['type'] == 'waypoint':
                    success = add_waypoint(data, waypoints) 

            connection.send(success)    



conn, child_conn = mp.Pipe()
drone_process = mp.Process(target=drone_handler, args=(child_conn, ))
drone_process.start()

@app.route('/', methods=['POST'])
def command():
    if request.method == 'POST':

        data = request.get_json()
        conn.send(data)
        success = conn.recv()
        return jsonify(success=success)

    return jsonify(success=False)




