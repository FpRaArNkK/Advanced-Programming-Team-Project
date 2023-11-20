import sys
import os
import pandas as pd
import numpy as np

from datetime import datetime
from dateutil.relativedelta import relativedelta

def get_names_by_theme(themes_list):
    current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
    folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
    DATA_FILE = "주식통합목록.xlsx"

    df = pd.read_excel(os.path.join(folder_dir, DATA_FILE), sheet_name='Sheet1')  # 파일 경로 설정
    target_industries = themes_list  # 여러 업종을 리스트에 담기

    symbols_list = df[df['업종'].isin(target_industries)]['Symbol Name'].tolist()
    print(symbols_list)

def get_names_by_name(stock_name):
    current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
    folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
    DATA_FILE = "주식통합목록.xlsx"

    df = pd.read_excel(os.path.join(folder_dir, DATA_FILE), sheet_name='Sheet1')  # 파일 경로 설정

    # Symbol Name 열을 인덱스로 설정
    df.set_index('Symbol Name', inplace=True)

    # 검색어 입력 받기
    search_query = stock_name

    # 조건에 맞는 데이터 검색
    symbols_list = df[df.index.str.contains(search_query)]
    symbol_names = symbols_list.index.tolist()
    
    print(symbol_names)


if __name__ == '__main__':
    if sys.argv[2] == "get_names_by_theme" :
        inputLine = sys.argv[1]
        themes_list = inputLine.split(',') # 쉼표로 분할된 문자열을 배열로 변환
        get_names_by_theme(themes_list)

    if sys.argv[2] == "get_names_by_name" :
        inputLine = sys.argv[1]
        # themes_list = inputLine.split(',') # 쉼표로 분할된 문자열을 배열로 변환
        get_names_by_name(inputLine)
    
