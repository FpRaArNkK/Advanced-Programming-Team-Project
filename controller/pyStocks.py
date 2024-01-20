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
    target_industries = themes_list  

    symbols_list = df[df['업종'].isin(target_industries)]['Symbol Name'].tolist() # 테마에 해당하는 업종을 모두 담기
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

    yoy=ps_ts/ps_ts.shift(1)-1   # 월간 수익률 구하기
    name=find_ts['Name']

    yoy = pd.concat([name,yoy],axis=1).dropna()

    # 안정성 지표
    fin_combi_Stabililty_A = yoy.query('부채비율<0.05')['Name'].unique()[:50] #yoy.query('부채비율<0.05').set_index('Name').index
        
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
    try:
        test_arr = stock_array.split(',') 

        current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
        folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
        DATA_FILE = "kSE수정종가.xlsx"

        data_wb = pd.ExcelFile(folder_dir + "/" + DATA_FILE)

        adj_price = data_wb.parse("Sheet1",  index_col=0)
        
        universe =adj_price[test_arr].loc[start_date:end_date]
        # print(universe)
        df=universe.resample('M').last().pct_change(1)  

        covmat= np.array(df.cov()*12)      # 수익률의 공분산

        rpo=risk_parity_optimization(covmat, df) # Risk Parity 모델 연결
        
        print(rpo)

    except Exception as e:
        print(f"An error occurred: {e}")

def index_100(ret_df):
    index_df = (1 + ret_df).cumprod() * 100
    return index_df
    #주식 지수의 100을 초기 값으로 하는 인덱스를 생성합니다.
    #(1 + ret_df).cumprod() * 100: 각 날짜별 수익률에 1을 더하고 누적 곱셈(cumulative product)을 수행하여 일간 수익률을 연속해서 곱한 후 100을 곱하여 초기 값이 100이 되도록 정규화합니다.
    #결과로 주식 지수의 100을 초기 값으로 하는 인덱스 데이터프레임을 반환합니다.

def get_chart_and_result(stock_array, start_date, end_date, seed_money, weight_array):
    try:
        current_dir = os.path.dirname(os.path.realpath(__file__))  # 현재 실행 중인 스크립트의 디렉터리 경로 가져오기
        folder_dir = os.path.join(current_dir, '../data')  # 상위 디렉터리의 'data' 폴더 경로 설정
        DATA_FILE = "kSE수정종가.xlsx"

        data_wb = pd.ExcelFile(folder_dir + "/" + DATA_FILE)

        adj_ts = data_wb.parse("Sheet1",  index_col=0)

        cprice=adj_ts.dropna(axis=1)   #  결측치가 있는 컬럼(주식)삭제 

        mprice= cprice.resample('M').mean()
            #월 단위로 데이터를 리샘플링하여 월간 주식 가격의 평균을 계산합니다. 이렇게 하면 월별로 주식 가격의 평균을 구할 수 있습니다.

        m_rate=mprice.shift(1)/mprice.shift(11)-1   
            #: 월간 주식 가격의 평균을 이용하여 월간 수익률을 계산합니다. 
            # shift(1)을 사용하여 현재 달의 데이터를 이전 달과 비교하고, shift(11)을 사용하여 12개월 전의 데이터를 가져와 12개월 수익률을 계산합니다.

        r_monthly=m_rate.dropna(axis=0)
        r_monthly.index = r_monthly.index.strftime('%Y-%m')   # 날짜 포멧 변경

        investment_period = pd.date_range(start_date, end_date, freq='Q').strftime('%Y-%m')  
            # 투자기간을 설정합니다. pd.date_range 함수를 사용하여 시작 날짜부터 끝 날짜까지 분기(quarterly) 주기로 날짜를 생성합니다. 
            # 그리고 strftime 함수를 사용하여 날짜 형식을 '연/월' 형식으로 변환하여 investment_period 저장합니다. 

        column_list = ['portfolio']
        portfolio_ret_df = pd.DataFrame(columns=column_list, index = cprice.loc[investment_period[0]:].index) #  포트폴리오 일간 수익률 저장

        for i in range(len(investment_period)):     

            ym = r_monthly[r_monthly.index==investment_period[i]].squeeze() # 시리즈로 변환

            filtered_index = [idx for idx in ym.index if idx in stock_array]
            filtered_ym = ym[ym.index.isin(filtered_index)]
            port_list = filtered_ym.index

            ### 포트폴리오 일간수익률    :  종목군들을 주가 데이터 날짜에 매칭하여   각 종목군별 일간 주가 수익률 평균 구해 저장
            portfolio_ret_df['portfolio'].loc[investment_period[i]:]= cprice[port_list].loc[investment_period[i]:].pct_change(1).mul(pd.Series(weight_array), axis=1).sum(axis=1)
            
        portfolio_ret_df.iloc[0] = 0
        portfolio_ret_df = portfolio_ret_df.dropna()

        plot_list = ['portfolio']

        print(index_100(portfolio_ret_df[plot_list]).loc[:end_date].resample('M').mean())  # 누적수익률에 월간 평균 내어 값 산출

    except Exception as e:
        print(f"An error occurred: {e}")
        
    

if __name__ == '__main__':
    if sys.argv[2] == "get_names_by_theme" :
        inputLine = sys.argv[1]
        themes_list = inputLine.split(',')
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

        portfolio_recommend_risk_parity(stock_array,start_date,end_date)
    
    if sys.argv[2] == "get_chart_and_result" :
        stock_array = sys.argv[1]
        start_date = sys.argv[3]
        end_date = sys.argv[4]
        seed_money = sys.argv[5]
        weight_array = sys.argv[6]
    
        get_chart_and_result(stock_array, start_date, end_date, seed_money, weight_array)