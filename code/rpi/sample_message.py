
import requests
import json
import time

'''
r = requests.post("http://127.0.0.1:5000/commands",
                  json={'message':'arm'})
print(r.json())
print(r.status_code, r.reason)
'''


while True:
    r = requests.get("http://127.0.0.1:5000/status")
    print(r.json())
    print(r.status_code, r.reason)
    time.sleep(1)

'''
r = requests.post("http://127.0.0.1:5000/waypoints", 
                  json=[{'key': '1', 'lat': '12.34', 'lon': '45.67', 'alt': '78.90', 'name': 'A'}, 
                        {'key': '2', 'lat': '10.12', 'lon': '432.3', 'alt': '-3', 'name': 'B'}])
print(r.status_code, r.reason)


r = requests.post("http://127.0.0.1:5000/commands", json={'message': 'take off 30'})
print(r.status_code, r.reason)


r = requests.post("http://127.0.0.1:5000/commands", json={'message': 'go A'})
print(r.status_code, r.reason)
'''
