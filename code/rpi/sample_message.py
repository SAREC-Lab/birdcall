
import requests
import json

r = requests.post("http://127.0.0.1:5000/", json={'message': 'takeoff'})
print(r.status_code, r.reason)

