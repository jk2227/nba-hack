import nltk
import numpy as np 
from sklearn import svm 
from sklearn.feature_selection import SelectKBest, chi2
import sqlite3 

connection = sqlite3.connect("nba.db") 
cursor = connection.cursor() 

cursor.execute("SELECT TOP 10 * FROM SHOT_SUMMARY")
result = cursor.fetchall()
for r in result: 
  print (r) 
