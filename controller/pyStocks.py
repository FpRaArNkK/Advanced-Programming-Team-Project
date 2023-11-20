import sys
import os
import pandas as pd
import numpy as np

from datetime import datetime
from dateutil.relativedelta import relativedelta

def getValue(themes_list):
    # print (list)
    # print(themes_list)
    current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
    folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
    DATA_FILE = "주식통합목록.xlsx"

    df = pd.read_excel(os.path.join(folder_dir, DATA_FILE), sheet_name='Sheet1')  # 파일 경로 설정
    # print(themes_list)
    target_industries = themes_list  # 여러 업종을 리스트에 담기

    # print(target_industries)
    # print(df)

    # symbols_list = df[df['업종'].isin(target_industries)]
    symbols_list = df[df['업종'].isin(target_industries)]['Symbol Name'].tolist()
    # symbols_list = df[df['업종'].isin(['전기/전자', '전기가스업'])]
    # symbols_list = df['업종'].isin([' 전기/전자', ' 전기가스업'])
    # print(df['업종'].unique())
    # symbols_list = df
    # symbols_list = [1234,12341,1234]
    # symbols_list = filtered_data['Symbol Name'].tolist()
    
    print(symbols_list)

if __name__ == '__main__':
    inputLine = sys.argv[1]
    # formatted_input = inputLine.replace("\n", "")
    themes_list = inputLine.split(',') # 쉼표로 분할된 문자열을 배열로 변환
    getValue(themes_list)
# - "python 파이썬파일.py"으로 파이썬 파일을 직접 실행하면 내부 변수 __name__에 "__main__" 값이 할당된다.
# 출처: https://curryyou.tistory.com/225 [카레유:티스토리]

# - 참고) import 등을 통해 모듈로 불러와 사용할 땐, __name__ 에 __main__이 아니라, 모듈 명이 들어간다.
# 출처: https://curryyou.tistory.com/225 [카레유:티스토리]

# def getName(name, age):
#     print (name + " : " + age)
#     #name, age 인자를 받아, 출력하는 getName함수를 정의

# if __name__ == '__main__':
#     getName(sys.argv[1], sys.argv[2])
#     #  함수를 호출하면서 sys.argv[1], sys.argv[2] 로 인수를 전달