# policy-tool-backend/app.py

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return 'Hey, we have Flask in a Docker container!'