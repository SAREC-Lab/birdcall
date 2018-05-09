# Birdcall

## Vision Statement

Birdcall is a mobile phone application that enables the user to control their drone using their voice. The user will speak commands into the app, which will communicate with an onboard Raspberry Pi to send commands to the drone. The user will be able to set up waypoints through an on screen UI, since it would be cumbersome to speak coordinates.

## Glossary

Raspberry Pi (Pi) - a basic, credit card sized computer that is capable of performing tasks such as running a web server. The Pi serves as a lightweight solution for communication between the App and Drone.

Drone Server - the web server being run on the Rasberry Pi. Responsible for receiving communication from the App and sending flight commands to the Drone.

Mobile Application (App) - the iOS app called Birdcall which is used to communicate with the server.

Waypoint - a destination defined by three characteristics: longitude, latitude, and altitude. In the birdcall application, waypoints can be given custom names which indicate the lon, lat and alt to which the drone should fly.

Return to Launch - a built in command in the drone software that tells the drone to land at the place from which it took off.

## The Team
![Picture not Found](docs/img/nd_fresh_team.png?raw=true "Team")
