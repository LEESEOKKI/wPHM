import time
import schedule
import datetime
import pandas as pd
import numpy as np
import csv

# def read_csv():
#     # with open('G_TEST.csv', 'r') as file:
#     #     reader = csv.reader(file)
#     #     data = list(reader)
#     data = pd.read_csv('G_TEST.csv')
#     data.loc[len(data)] = np.random.uniform(0,1,size = len(data.columns))
#     now = datetime.datetime.now()
#     data['time'].iloc[-1] = now
#     data = data.iloc[-1,:]
#     return data.tolist()

# def write_csv(data,filename):
#     with open('test/'+filename+'.csv', 'w', newline='') as file:
#         writer = csv.writer(file)
#         writer.writerows(data)


def read_csv():
    data = pd.read_csv('G_TEST.csv')
    data.loc[len(data)] = np.random.uniform(0,1,size = len(data.columns))
    now = datetime.datetime.now()
    data.at[len(data)-1, 'time'] = now
    # data = data.iloc[[0,-1],:]
    # last_row = data.iloc[-1]
    keys = data.columns.values.tolist()
    # data = pd.DataFrame([last_row[key] for key in keys], index=keys, columns=['Last Row'])
    # now = datetime.datetime.now()
    date = now.strftime('%Y.%m.%d-')  # '%Y-%m-%d': 년-월-일
    times = now.strftime('%H.%M.%S')  # '%H:%M:%S': 시:분:초
    new_df = data.iloc[[-1]]
    new_df.to_csv('test/'+'WIDAS.csv', header=keys, index = False)
    # return data

def write_csv(data,filename):
    with open('test/'+filename+'.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(data)

def job():
    data = read_csv()
    # now = datetime.datetime.now()
    # date = now.strftime('%Y.%m.%d-')  # '%Y-%m-%d': 년-월-일
    # times = now.strftime('%H.%M.%S')  # '%H:%M:%S': 시:분:초
    # print(date+times)
    # write_csv(data,date+times)

schedule.every(20).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
