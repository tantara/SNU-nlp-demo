from flask import Flask, jsonify, request, render_template, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = "secret-demo!"
socketio = SocketIO(app)

import json
import re
import os
from fastText import load_model

classifier = load_model('./hacker-earth-skipgram.bin')
namespace = "/channel"
uid = 1

@app.before_request
def before_request():
    global uid

    if 'session' in session and 'user-id' in session:
        pass
    else:
        session['session'] = os.urandom(24)
        session['user-id'] = 'user'+str(uid)
        uid += 1


def refine(text):
    txt = str(text)
    txt = re.sub(r'[^A-Za-z0-9\s]',r'',txt)
    txt = re.sub(r'\n',r' ',txt)
    return txt.lower()


@app.route("/", methods=['GET'])
def home():
    return render_template("home.html")


@app.route("/predict", methods=['POST'])
def predict():
    data = json.loads(request.get_data(as_text=True))
    text = refine(data['q'])

    labels, _ = classifier.predict(text)
    sentiment = "happy" if labels[0] == "__label__2" else "not happy"

    socketio.emit("response", { 'text': data['q'], 'sentiment': sentiment }, broadcast=True, namespace=namespace)
    return jsonify({ 'sentiment': sentiment })


@socketio.on('connect', namespace=namespace)
def connect():
    print("connect:", uid)


@socketio.on('disconnect', namespace=namespace)
def disconnect():
    print("disconnect:", uid)
    session.clear()


if __name__ == '__main__':
    app.debug = True
    socketio.run(app, host='0.0.0.0', port=5000)
    # app.run(host='0.0.0.0', port=5000, threaded=True)
