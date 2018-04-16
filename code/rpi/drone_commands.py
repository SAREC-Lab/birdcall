from __future__ import print_function
import time
from dronekit import connect, VehicleMode, LocationGlobalRelative


def takeoff(vehicle, spl):
    
    #default altitude is 30 meters
    if len(spl) == 3:
        alt = int(spl[2])
    else:
        alt = 30

    if not vehicle.is_armable:
        return False

    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        time.sleep(.01)
    
    vehicle.simple_takeoff(alt) 


def goto(vehicle, spl, waypoints):
    name = ' '.join(spl)
    vehicle.simple_goto(waypoints[name])

def set_waypoints(data):
    waypoints = {}

    for dat in data:
        waypoints[dat['name']] = LocationGlobalRelative(float(dat['lat']), 
                                                        float(dat['lon']), 
                                                        float(dat['alt']))

    return True, waypoints


def return_to_launch(vehicle):
    vehicle.mode = VehicleMode("RTL")


def get_status(vehicle):

    if vehicle is None:
        return False
    else:
        return vehicle.is_armable

    
