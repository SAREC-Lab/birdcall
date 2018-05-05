from __future__ import print_function
import time
from dronekit import VehicleMode, LocationGlobalRelative


def takeoff(vehicle, spl):

    #default altitude is 30 meters
    if len(spl) == 3:
        alt = int(spl[2])
    else:
        alt = 30

    while not vehicle.is_armable:
        print('waiting for vehicle to be armable')
        time.sleep(1)

    vehicle.mode = VehicleMode('GUIDED')
    vehicle.armed = True

    while not vehicle.armed:
        print('waiting for vehicle to be armed')
        time.sleep(1)

    vehicle.simple_takeoff(alt)

    while vehicle.mode.name == 'GUIDED':
        print('altitude: {}'.format(vehicle.location.global_relative_frame.alt))
        if vehicle.location.global_relative_frame.alt >= alt * 0.95:
            break
        time.sleep(1)

    return True


def goto(vehicle, spl, waypoints):
    name = ' '.join(spl)
    print('name: {}'.format(name))
    if name in waypoints:
        print(waypoints[name].lat)
        print(waypoints[name].lon)
        print(waypoints[name].alt)
    vehicle.simple_goto(waypoints[name])
    return True


def set_waypoints(data):
    waypoints = {}

    for dat in data:
        waypoints[dat['name']] = LocationGlobalRelative(float(dat['lat']),
                                                        float(dat['lon']),
                                                        float(dat['alt']))
    return True, waypoints


def return_to_launch(vehicle):
    print('returning to launch')
    vehicle.mode = VehicleMode('RTL')
    return True


def get_status(vehicle):
    if vehicle is None:
        return False
    else:
        return vehicle.is_armable
