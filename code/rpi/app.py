from __future__ import print_function
import argparse
import multiprocessing as mp

from dronekit import connect
from flask import Flask, request, jsonify

import drone_commands as dc

app = Flask(__name__)


def parse_message(msg, vehicle, waypoints):
    ''' return success of command '''
    spl = msg.split()

    if spl[:2] == ['take', 'off']:
        return dc.takeoff(vehicle, spl[2:])

    # if the vehicle is not in guided, then do nothing
    if vehicle.mode.name != 'GUIDED':
        return False

    if spl[:2] == ['go', 'to']:
        return dc.goto(vehicle, spl, waypoints)

    if spl[:3] == ['return', 'to', 'launch']:
        return dc.return_to_launch(vehicle)


def drone_handler(command_connection, waypoint_connection, status_connection,
                  conn_str):

    #initialize the drone
    if not conn_str:
        import dronekit_sitl
        sitl = dronekit_sitl.start_default()
        conn_str = sitl.connection_string()

    vehicle = connect(conn_str, wait_ready=False, baud=57600)

    waypoints = {}

    while True:
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
                success, waypoints = dc.set_waypoints(data)

            waypoint_connection.send(success)
            print(waypoints)

        if status_connection.poll():
            data = status_connection.recv()
            status = dc.get_status(vehicle)

            status_connection.send(status)



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

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('--connect',
                        help='Connection target string for the drone. If empty, then sitl is used')
    arguments = parser.parse_args()

    connection_str = arguments.connect

    command_conn, child_command_conn = mp.Pipe()
    waypoint_conn, child_waypoint_conn = mp.Pipe()
    status_conn, child_status_conn = mp.Pipe()

    drone_process = mp.Process(target=drone_handler, args=(child_command_conn,
                                                           child_waypoint_conn,
                                                           child_status_conn,
                                                           connection_str))
    drone_process.start()
    app.run(host='0.0.0.0')
