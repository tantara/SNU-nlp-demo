# Demo for sentiment analysis with FastText

Final Project for Natural Language Processing(2017 Fall) at SNU

## Prerequisites

Install `fastText` python library as follows,

```
$ git clone https://github.com/facebookresearch/fastText.git
$ cd fastText
$ python setup.py install
```

## Installation

```
$ virtualenv .env --python=`which python3`
$ source .env/bin/activate
$ pip install -r requirements.txt
```

and **download pre-trained model** from [here](https://drive.google.com/open?id=1-FGVPhgnr8kjl55FOjNqDYFOLku9WSdj). It is tiny model(about 700MB) due to the limit of memory, so it can decrease accuracy a bit.

## Run

### Production Mode

```
$ FLASK_APP=app.py flask run
$ open http://localhost:5000 # open new tab first
```

### Development Mode

```
$ FLASK_DEBUG=1 FLASK_APP=app.py flask run
$ open http://localhost:5000 # open new tab first
```

Features as follows:

- Support live reload when codes are changed

## Usage

### with web browser

Browse [http://localhost:5000/](http://localhost:5000)

### with `curl`

*Request*

```
$ curl --request POST \
  --url http://localhost:5000/predict \
  --header 'content-type: application/json' \
  --data '{
	"q": "I am very happy"
}'
```

*Response*

```
{
  "sentiment": "happy"
}
```

## Author

- Taekmin Kim, [tantara@snu.ac.kr](mailto:tantara@snu.ac.kr)
- Seokjun Seo, [dane2522@gmail.com](mailto:dane2522@gmail.com)
