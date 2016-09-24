from flask import Flask

import pandas as pd
import json
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy import inspect

def object_as_dict(obj):
  return {c.key: getattr(obj, c.key)
          for c in inspect(obj).mapper.column_attrs}

engine = create_engine('sqlite:///nba.db')

def run_query(query):
  sql = text(query)
  result = engine.execute(sql)
  rows = []
  for row in result:
    d = {}
    for column in row.keys():
      d[column] = row[column]
    rows.append(d)
  return rows

app = Flask(__name__)

@app.route('/query/<query_str>')
def query(query_str):
    rows = run_query(query_str)
    return json.dumps(rows)

@app.route('/')
def load():
  return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run()
