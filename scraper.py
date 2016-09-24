import requests
import json
import os 
import pandas as pd
from threading import Thread, Lock, Condition, Semaphore

queue = [] 
lock = Lock() 
producer = Condition(lock)
consumer = Condition(lock) 
shot_url = 'http://stats.nba.com/stats/shotchartdetail?Period=0&VsConference=&LeagueID=00&LastNGames=0&TeamID=0&Position=&Location=&ContextMeasure=FGA&DateFrom=&StartPeriod=&DateTo=&OpponentTeamID=0&ContextFilter=&RangeType=&Season=%s&AheadBehind=&EndRange=&VsDivision=&PointDiff=&RookieYear=&GameSegment=&Month=0&ClutchTime=&StartRange=&EndPeriod=&SeasonType=Regular+Season&SeasonSegment=&GameID=&PlayerID=%s&Outcome='
headings = ["SEASON", "GAME_ID","GAME_EVENT_ID", "PLAYER_ID","PLAYER_NAME",
  "TEAM_ID","TEAM_NAME","PERIOD","MINUTES_REMAINING","SECONDS_REMAINING",
  "EVENT_TYPE","ACTION_TYPE","SHOT_TYPE","SHOT_ZONE_BASIC", "SHOT_ZONE_AREA",
  "SHOT_ZONE_RANGE","SHOT_DISTANCE","LOC_X","LOC_Y",
  "SHOT_ATTEMPTED_FLAG","SHOT_MADE_FLAG"]
writeLock = Lock()

class Worker(Thread): 
  def __init__(self): 
    Thread.__init__(self)
    self.start()

  def run(self): 
    global queue
    while True:
      with lock: 
        while len(queue) == 0:
          consumer.wait()
        job = queue[0] 
        queue = queue[1:] 
        producer.notify()
      ct = ConnectionHandler(job) 
      ct.handle() 

class ConnectionHandler:
  def __init__(self, season_playerId_pair):
    self.season = season_playerId_pair[0]
    self.player_id = season_playerId_pair[1]
    self.shot_url = shot_url % (self.season, self.player_id)
    self.u_a = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/480.0.2564.109 Safari/537.36"
    
  def handle(self):    
        response = requests.get(self.shot_url, headers={"USER-AGENT":self.u_a})
        shot_data = response.json()['resultSets'][0]['rowSet']
        df = pd.DataFrame(columns=headings)
        print(str(self.player_id))
        for shot in shot_data:
            shot[0] = self.season
            shot[1] = int(shot[1])
            dfTemp = pd.DataFrame([shot], columns=headings)
            df = df.append(dfTemp)
        with writeLock:
          with open('shot_details.csv' ,'a') as out:
            df.to_csv(out, header=True)
        print("finished writing" + str(self.player_id))

class ThreadPool: 
  def __init__(self, numWorkers):
    self.max = numWorkers
    for i in range(numWorkers):
      Worker() 
  
  def add(self, season_id, player_id): 
    global queue
    with lock: 
      while len(queue) == self.max:
        producer.wait()
      queue.append((season_id, str(player_id))) 
      consumer.notify() 
      
def main(): 

  # seasons of interest 
  seasons = ['2014-15', '2015-16'] 
  u_a = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/480.0.2564.109 Safari/537.36"

  #player ids for a particular season
  season_to_player_ids = {}
  for season in seasons: 
    player_ids_url = 'http://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=%s&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight=' % season
    response = requests.get(player_ids_url, headers={"USER-AGENT": u_a}) 
    player_data = response.json()['resultSets'][0]['rowSet']
    season_to_player_ids[season] = [x[0] for x in player_data]

  threadPool = ThreadPool(300) 
  for season in season_to_player_ids :
      for player_id in season_to_player_ids[season]: 
        threadPool.add(season, player_id) 

main()
