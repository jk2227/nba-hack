import pandas as pd
from sqlalchemy import create_engine

disk_engine = create_engine('sqlite:///nba.db')

def nba_create_table(table_name):
  print "importing: " + table_name
  for df in pd.read_csv('data/' + table_name + '.csv', iterator=True, encoding='utf-8'):
    df.to_sql("box_scores", disk_engine, if_exists='append')

if __name__ == "__main__":
  # nba_create_table('shot_details')
  # nba_create_table('play_by_play')
  # nba_create_table('player_names_matched_team')
  # nba_create_table('playoff_hustle_stats_2016')
  # nba_create_table('sv_box_scores_2014-15')
  nba_create_table('sv_box_scores_2015-16')
  # nba_create_table('sv_rebound_summary_2014-15')
  # nba_create_table('sv_rebound_summary_2015-16')
  # nba_create_table('sv_shot_summary_2014-15')
  # nba_create_table('sv_shot_summary_2015-16')
  # nba_create_table('teamid_link')
  # nba_create_table("sv_possession_summary_2015-16")
  # nba_create_table("sv_possession_summary_2014-15")
