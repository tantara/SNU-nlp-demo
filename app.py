from flask import Flask, jsonify, request, render_template
app = Flask(__name__)

import json
import re
from fastText import load_model

classifier = load_model('./hacker-earth-skipgram.bin')

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

    return jsonify({ 'sentiment': sentiment })

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
