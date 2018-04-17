
import multiprocessing as mp
from flask import Flask, request, jsonify
import dronekit_sitl
from dronekit import connect, VehicleMode

from drone_commands import *

app = Flask(__name__)
    

def parse_message(msg, vehicle, waypoints):

    spl = msg.split()
    
    if spl[:2] == ['take', 'off']:
        success = takeoff(vehicle, spl[2:])
    elif spl[:2] == ['go', 'to']:
        success = goto(vehicle, spl, waypoints)
    elif spl[:3] == ['return', 'to', 'launch']:
        return_to_launch(vehicle)
    
    return success


def drone_handler(command_connection, waypoint_connection, status_connection):

    #initialize the drone
    sitl = dronekit_sitl.start_default()
    connection_string = sitl.connection_string()
    vehicle = connect(connection_string, wait_ready=False)

    waypoints = {}

    while True:

        if vehicle.mode.name == GUIDED:
            continue

        if command_connection.poll():
            data = command_connection.recv()
            success = False

            if isinstance(data, dict):

                msg = data['message']
                success = parse_message(msg, vehicle, waypoints)

            command_connection.send(success)    

        if waypoint_connection.poll():
            data = waypoint_connection.recv()
            success = False

            if isinstance(data, list):
                success, waypoints = set_waypoints(data) 

            waypoint_connection.send(success)    
            print(waypoints)

        if status_connection.poll():
            data = status_connection.recv()
            status = get_status(vehicle)

            status_connection.send(status)

command_conn, child_command_conn = mp.Pipe()
waypoint_conn, child_waypoint_conn = mp.Pipe()
status_conn, child_status_conn = mp.Pipe()

drone_process = mp.Process(target=drone_handler, args=(child_command_conn, 
                                                       child_waypoint_conn,
                                                       child_status_conn))
drone_process.start()

@app.route('/commands', methods=['POST'])
def command():
    if request.method == 'POST':

        data = request.get_json()
        command_conn.send(data)
        success = command_conn.recv()
        return jsonify(success=success)

    return jsonify(success=False)


@app.route('/waypoints', methods=['POST'])
def waypoints_command():
    if request.method == 'POST':
        waypoints = request.get_json()
        waypoint_conn.send(waypoints)
        success = waypoint_conn.recv()
        return jsonify(success=success)

    return jsonify(success=False)


@app.route('/status', methods=['GET'])
def status_command():

    if request.method == 'GET':
        status_conn.send('')
        status = status_conn.recv()
        return jsonify({'ready': status})

    return jsonify(success=False)


