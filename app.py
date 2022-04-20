import asyncio
import imp
import json
import sys
from flask import Flask, jsonify, request 
import flask
from flask_cors import CORS
import serial.tools.list_ports
import os

ports  = serial.tools.list_ports.comports()


app = Flask(__name__)
# app_config = {"host": "0.0.0.0", "port": 3001}
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}
"""
---------------------- DEVELOPER MODE CONFIG -----------------------
"""
# Developer mode uses app.py
if "app.py" in sys.argv[0]:
  # Update app config
  app_config["debug"] = True

  # CORS settings
  cors = CORS(
    app,
    resources={r"/*": {"origins": "http://localhost*"}},
  )

  # CORS headers
  app.config["CORS_HEADERS"] = "Content-Type"


"""
--------------------------- REST CALLS -----------------------------
"""
# Remove and replace with your own
@app.route("/example")
def example():

  # See /src/components/App.js for frontend call
  return jsonify("Example response from Flask! Learn more in /app.py & /src/components/App.js")


"""
-------------------------- APP SERVICES ----------------------------
"""
# Quits Flask on Electron exit
@app.route("/quit")
def quit():
  shutdown = request.environ.get("werkzeug.server.shutdown")
  shutdown()

  return


@app.route("/getport")
def getport():
  portlist =[]
  for port ,desc ,hwid in sorted(ports):
      print(port)
      portlist.append(port)    
  print(portlist)
  return jsonify(portlist)

# esptool.chip_id(esp=esptool.esp32,args='')

@app.route('/upload', methods=['POST'])
def upload():
      print(request.method)
      print(request.data)
      data = json.loads(request.data)
      print(data['boot'])
      # print("esptool.py --chip esp32 --port {0} --baud 115200 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 {1} 0x1000 {2} 0x8000 {3} 0x10000 {4} 0x00290000 {5}".format(data['port'],data['boot'],data['flash'],data['patFile'],data['binFile'],data['spiFile']))
      os.system('esptool.py --chip esp32 --port {} --baud 115200 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 {} 0x1000 {} 0x8000 {} 0x10000 {} 0x00290000 {}'.format(data['port'],data['boot'],data['flash'],data['patFile'],data['binFile'],data['spiFile']))
      return jsonify("ok")
          # if request.method == 'POST': 
      #   print(request.data)
        
    # return jsonify("success");


if __name__ == "__main__":
  app.run(**app_config)
