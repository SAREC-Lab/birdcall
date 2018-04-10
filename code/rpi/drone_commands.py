from __future__ import print_function
import time
from dronekit import connect, VehicleMode, LocationGlobalRelative



def arm_and_takeoff(vehicle, alt):

    while not vehicle.is_armable:
        time.sleep(1)

    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        time.sleep(1)

    vehicle.simple_takeoff(alt) 

    while True:
        if vehicle.location.global_relative_frame.alt >= alt * 0.95:
            print("Reached target altitude")
            break
        time.sleep(1)


