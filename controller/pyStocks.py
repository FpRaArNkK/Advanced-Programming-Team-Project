import sys
import os
import ast
import pandas as pd
import numpy as np
import scipy.optimize as sco 

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

def get_names_by_index(index):
    current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
    folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
    DATA_FILE = "KSE_FIN_DATA_2023.xlsx"

    data_wb = pd.ExcelFile(folder_dir + "/" + DATA_FILE)

    find_ts = data_wb.parse("Sheet1", index_col=3)  # index_col=3은 Name을 index로.

    # 수익성 지표
    find_ts ['영업이익율']=find_ts ['영업이익']/find_ts["매출액"]
    find_ts ['ROE']=find_ts ['당기순이익']/find_ts["총자본"]
    find_ts ['ROA']=find_ts ['당기순이익']/find_ts["총자산"]

    # 안정성 지표
    find_ts ['부채비율']=find_ts ['총부채']/find_ts["총자본"]

    # 성장성 지표
    # 매출액 증가율
    # 영업이익 증가율
    # 순이익 증가율

    ps_ts= find_ts[['매출액','영업이익','당기순이익','EPS','BPS','SPS','CFPS','영업이익율','ROE','ROA','부채비율']] 

    yoy=ps_ts/ps_ts.shift(1)-1   
    name=find_ts['Name']

    yoy = pd.concat([name,yoy],axis=1).dropna()

    # 수익성 지표
    # fin_combi_Profitability_A = yoy.query('영업이익율>0.3')['Name'].unique()[:50]  # fin_combi_Profitability_A = yoy.query('영업이익율>0.3').set_index('Name').index
    # fin_combi_Profitability_B = yoy.query('ROE>0.3')['Name'].unique()[:50] #yoy.query('ROE>0.3').set_index('Name').index
    # fin_combi_Profitability_C = yoy.query('ROA>0.3')['Name'].unique()[:50] #yoy.query('ROA>0.3').set_index('Name').index
    
    # 안정성 지표
    fin_combi_Stabililty_A = yoy.query('부채비율<0.05')['Name'].unique()[:50] #yoy.query('부채비율<0.05').set_index('Name').index
    
    # 성장성 지표
    # fin_combi_Growth_A = yoy.query('매출액>0.3')['Name'].unique()[:50] #yoy.query('매출액>0.3').set_index('Name').index
    # fin_combi_Growth_B = yoy.query('영업이익>0.3')['Name'].unique()[:50] #yoy.query('영업이익>0.3').set_index('Name').index
    # fin_combi_Growth_C = yoy.query('당기순이익>0.3')['Name'].unique()[:50] #yoy.query('당기순이익>0.3').set_index('Name').index
        
    # 수익성 지표    
    fin_ex_Profit = yoy.query('(영업이익율 > 0.3) & (ROE > 0.3) & (ROA > 0.3)')['Name'].unique()[:50] #.set_index('Name').index
    # 성장성 지표
    fin_ex_Growth = yoy.query('(매출액 > 0.3) & (영업이익 > 0.3) & (당기순이익 > 0.3)')['Name'].unique()[:50] #.set_index('Name').index
    
    if (index == "profit") :
        print(fin_ex_Profit)

    if (index == "stability"):
        print(fin_combi_Stabililty_A)

    if (index == "growth"):
        print(fin_ex_Growth)
       

def Risk_Contribution(weight,cov_matrix) :
    
    weight =np.array(weight)
    std=np.sqrt(np.dot(weight.T,np.dot(cov_matrix,weight)))
    mrc=np.dot(cov_matrix,weight)/std
    rc=weight*mrc
    
    return rc, std

def risk_parity_target(weight, covmat) :
    
    rc,std=Risk_Contribution(weight, covmat)
    RC_assets=rc
    RC_target=std/len(rc)
    objective_fun=np.sum(np.square(RC_assets-RC_target.T))
    
    return objective_fun

def risk_parity_optimization(cov_matrix, df):
    
    TOLERANCE= 1e-20
    num_assets=len(cov_matrix)
    constraints=({'type': 'eq','fun': lambda x: np.sum(x)-1.0},{'type': 'ineq','fun': lambda x: x})  
    result=sco.minimize(risk_parity_target,num_assets*[1./num_assets,],method='SLSQP',
                       constraints=constraints, tol=TOLERANCE, args=(cov_matrix,))    
    Risk_Parity_Allocation=pd.DataFrame(result.x,index=df.columns,columns=['allocation'])
 
    return  round(Risk_Parity_Allocation*100,2)             

def portfolio_recommend_risk_parity(stock_array,start_date,end_date):
    
    test_arr = ast.literal_eval(stock_array)

    current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
    folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
    DATA_FILE = "kSE수정종가.xlsx"

    data_wb = pd.ExcelFile(folder_dir + "/" + DATA_FILE)

    adj_price = data_wb.parse("Sheet1",  index_col=0)

    universe =adj_price[test_arr].loc['2015-01-01':'2023-08-25']
    df=universe.resample('M').last().pct_change(1)  

    covmat= np.array(df.cov()*12)      # 수익률의 공분산

    rpo=risk_parity_optimization(covmat, df) 

    print(rpo)
        
    

if __name__ == '__main__':
    if sys.argv[2] == "get_names_by_theme" :
        inputLine = sys.argv[1]
        themes_list = inputLine.split(',') # 쉼표로 분할된 문자열을 배열로 변환
        get_names_by_theme(themes_list)

    if sys.argv[2] == "get_names_by_name" :
        inputLine = sys.argv[1]
        get_names_by_name(inputLine)

    if sys.argv[2] == "get_names_by_index" :
        index = sys.argv[1]
        get_names_by_index(index)

    if sys.argv[2] == "portfolio_recommend_risk_parity" :
        stock_array = sys.argv[1]
        start_date = sys.argv[3]
        end_date = sys.argv[4]
        # themes_list = inputLine.split(',') # 쉼표로 분할된 문자열을 배열로 변환
        portfolio_recommend_risk_parity(stock_array,start_date,end_date)
    
