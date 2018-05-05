from __future__ import print_function
import time
from dronekit import VehicleMode, LocationGlobalRelative
from pymavlink import mavutil


def takeoff(vehicle, spl):

    #default altitude is 30 meters
    if len(spl) == 3:
        alt = int(spl[2])
    else:
        alt = 15

    while not vehicle.is_armable:
        print('waiting for vehicle to be armable')
        time.sleep(1)

    vehicle.mode = VehicleMode('GUIDED')

    while vehicle.mode.name != 'GUIDED':
        print('waiting for guided')
        vehicle.mode = VehicleMode('GUIDED')
        time.sleep(2)

    vehicle.armed = True

    while not vehicle.armed:
        print('waiting for vehicle to be armed')
        vehicle.armed = True
        time.sleep(1)
    
    print('taking off to ' + str(alt))
    vehicle.simple_takeoff(alt)

    while vehicle.mode.name == 'GUIDED':
        print('altitude: {}'.format(vehicle.location.global_relative_frame.alt))
        if vehicle.location.global_relative_frame.alt >= alt * 0.95:
            break
        time.sleep(1)

    return True


def set_speed(drone, speed):
        msg = drone.message_factory.command_long_encode(
            0, 0,  # target system, target component
            mavutil.mavlink.MAV_CMD_DO_CHANGE_SPEED,  # command
            0,  # confirmation
            0,  # param 1
            speed,  # speed in metres/second
            0, 0, 0, 0, 0  # param 3 - 7
        )

        # send command to vehicle
        drone.send_mavlink(msg)
        drone.flush()

def goto(vehicle, spl, waypoints):
    name = ' '.join(spl)
    print(waypoints[name].lat)
    print(waypoints[name].lon)
    print(waypoints[name].alt)
    vehicle.simple_goto(waypoints[name])
    set_speed(vehicle, 10)
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

