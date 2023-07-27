import paramiko
import time
import boto3
import pandas as pd
import networkx as nx
import csv
from pymongo import MongoClient
from datetime import datetime
import os
import requests

url = 'https://k8s101.p.ssafy.io/be/sse/'  # 요청할 API의 URL

client = MongoClient("mongodb://ssafy:ssafy1111@3.36.125.122:27017/?authMechanism=DEFAULT&authSource=admin")
db = client['admin']

edges_file = "csv/N_False.edges"
def edges_f():
    # edges 파일 읽어서 그래프에 노드와 edge 추가
    with open(edges_file) as f:
        print('엣지파일수정')
        reader = csv.reader(f)
        for row in reader:
            if row[0] == "root":
                child_node = machinename
            else:
                child_node = row[0]

            if row[1] == "root":
                parent_node = machinename
            else:
                parent_node = row[1]

            weight = float(row[2])
            G.add_edge(parent_node, child_node, weight = weight, collection = db[machinename])

def s3_connection():
    try:
        # s3 클라이언트 생성
        s3 = boto3.client(
            service_name="s3",
            region_name="ap-northeast-2",
            aws_access_key_id='AKIA5Z3I5G4VISKY7QLC',
            aws_secret_access_key='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',
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3

# SSH 연결 설정
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('3.36.125.122', port=8282, username='root', password='root')

s3 = s3_connection()

# 감지할 디렉토리 경로
watch_dir = '/app/test'

# SSH 클라이언트를 이용하여 원격 서버에서 파일 생성 감지
while True:
    stdin, stdout, stderr = ssh.exec_command('inotifywait -q -e modify "{}"'.format(watch_dir))
    
    for line in stdout:
        # 파일 생성 이벤트가 감지되면 이 부분에서 원하는 작업을 수행합니다.
        filename = line.strip().split()[-1]  # 파일 이름 추출
        print(filename)
        G=nx.DiGraph()
        sftp = ssh.open_sftp()
        remote_file_path = f"{watch_dir}/{filename}"
        local_file_path = f"/app/csv/{filename}"  # 로컬 디렉토리에 저장할 파일 경로
        sftp.get(remote_file_path, local_file_path)  # 파일 가져오기
        sftp.close()
        sendData=filename.replace('.csv','')
        machinename = sendData
        collection = db[machinename]
        if(sendData=='WIDAS'):
            edges_file='csv/machine_A.edges'
            print('WIDAS다', sendData)
        elif(sendData=='HYETA'):
            edges_file='csv/HYETA.edges'
            print('machine_B다 ',sendData)
        elif(sendData=='QUANTA'):
            edges_file='csv/QUANTA.edges'
            print('QUANTA다', sendData)

        print("파일 가져왔다")
        edges_f()
        now =datetime.now()
        now = now.strftime("%Y-%m-%d %H:%M:%S.%f")
        try:
            s3.upload_file(f"/app/csv/{filename}","wonik-data",f"{filename}/"+now)
        except Exception as e:  
            print(e)

        filepath = f"/app/csv/{filename}"

        
        data = pd.read_csv(filepath)

        date = data['time'].iloc[-1]
        date = datetime.strptime(date, '%Y-%m-%d %H:%M:%S.%f')
        agg_data = data.iloc[:,1:141].mean()
        
        for index,row in agg_data.items():
            node_name = index
            data = row
            G.nodes[node_name]['data'] = data
        
        node_values = {}
        
        for node in (list(nx.dfs_postorder_nodes(G))):
            if G.out_degree(node) == 0:
                node_values[node] = G.nodes[node]['data']
            else:
                child_values = [node_values[child] for child in G.successors(node)]
                parent_value = sum([child_values[i] * G[node][child]['weight']  for i, child in enumerate(G.successors(node))])
                node_values[node] = parent_value

        documents = []
        for node in G.nodes:
            # 노드 이름
            node_name = node
            # 노드 값
            node_value = node_values[node]
            # 부모 노드 이름
            parent_nodes = list(G.predecessors(node))
            if(len(parent_nodes) == 0):
                documents.append({
                    'name': node_name,
                    'value' : node_value,
                    'parent': 'first',
                    'date': date
                })
                print('최상단노드',node_name,node_value)
                if(node_value<0.3):
                    requests.post(url+f"newerror/{sendData}", data=sendData)
                    print(url+f"newerror/{sendData}")
            else:
                for parent_node in parent_nodes:
                    documents.append({
                        'name': node_name,
                        'value' : node_value,
                        'parent' : parent_node,
                        'date': date
                    })
                
        try:
            res = collection.insert_many(documents)
        
            if res.acknowledged:
                print("url이다",url+"test/"+sendData)
                requests.get(url+"test/"+sendData, data=sendData)  # get 요청 보내기
                os.remove(f"/app/csv/{filename}")
                print(f"{filepath} deleted")
        except Exception as e:
            print('에러다')
            print(e)

    time.sleep(1)
