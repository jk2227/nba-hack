import requests
import json
import os 

u_a = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"

# seasons of interest 
seasons = ['2014-15', '2015-16'] 

#player ids for a particular season
season_to_player_ids = {}
for season in seasons: 
  player_ids_url = 'http://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=%s&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight=' % season
  response = requests.get(player_ids_url, headers={"USER-AGENT": u_a}) 
  #unmapped_players = filter(lambda x: x[1] and x[1].encode('utf') in season_players_map[season] , response.json()['resultSets'][0]['rowSet'])
  player_data = response.json()['resultSets'][0]['rowSet']
  season_to_player_ids[season] = [x[0] for x in player_data]

print season_to_player_ids

shot_url = 'http://stats.nba.com/stats/shotchartdetail?Period=0&VsConference=&LeagueID=00&LastNGames=0&TeamID=0&Position=&Location=&ContextMeasure=FGA&DateFrom=&StartPeriod=&DateTo=&OpponentTeamID=0&ContextFilter=&RangeType=&Season=%s&AheadBehind=&EndRange=&VsDivision=&PointDiff=&RookieYear=&GameSegment=&Month=0&ClutchTime=&StartRange=&EndPeriod=&SeasonType=Regular+Season&SeasonSegment=&GameID=&PlayerID=%s&Outcome='

for season in season_to_player_ids :
    for player_id in season_to_player_ids[season]: 
        player_games_all = shot_url % (season, str(player_id))
        response = requests.get(player_games_all, headers={"USER-AGENT":u_a})
        shot_data = response.json()['resultSets'][0]['rowSet']
        for shot in shot_data:
            print shot
        
        
        