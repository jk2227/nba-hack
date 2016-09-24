import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy import text

engine = create_engine('sqlite:///nba.db')

def run_query(query):
  sql = text(query)
  result = engine.execute(sql)
  rows = []
  for row in result:
    rows.append(row)
  return rows

if __name__ == "__main__":
  # Example query
  rows = run_query('select * from teamid_link where "index" > 5')
  for row in rows:
    print row["Team.Name"]




