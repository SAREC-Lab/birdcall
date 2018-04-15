
import requests
import json

r = requests.post("http://127.0.0.1:5000/", json={'type': 'command', 'message': 'takeoff 30'})
print(r.status_code, r.reason)

r = requests.post("http://127.0.0.1:5000/", json={'type': 'waypoint', 'lat': 0.0, 'lon': 0.0, 'alt': 40, 'name' : '0'})
print(r.status_code, r.reason)


r = requests.post("http://127.0.0.1:5000/", json={'type': 'command', 'message': 'go 0'})
print(r.status_code, r.reason)
