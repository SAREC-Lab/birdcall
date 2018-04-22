#!/usr/bin/env bash
[ "$1" == "takeoff" ] && curl -d '{"message":"take off"}' -H "Content-Type: application/json" -X POST http://0.0.0.0:5000/commands

[ "$1" == "return" ] && curl -d '{"message":"return to launch"}' -H "Content-Type: application/json" -X POST http://0.0.0.0:5000/commands

[ "$1" == "status" ] && curl "http://0.0.0.0:5000/status"
