import sys 
# 매개변수를 받기위해 파이썬의 sys 모듈을 임포트

def getValue():
    print ("value")

if __name__ == '__main__':
    getValue()
# - "python 파이썬파일.py"으로 파이썬 파일을 직접 실행하면 내부 변수 __name__에 "__main__" 값이 할당된다.
# 출처: https://curryyou.tistory.com/225 [카레유:티스토리]

# - 참고) import 등을 통해 모듈로 불러와 사용할 땐, __name__ 에 __main__이 아니라, 모듈 명이 들어간다.
# 출처: https://curryyou.tistory.com/225 [카레유:티스토리]

def getName(name, age):
    print (name + " : " + age)
    #name, age 인자를 받아, 출력하는 getName함수를 정의

if __name__ == '__main__':
    getName(sys.argv[1], sys.argv[2])
    #  함수를 호출하면서 sys.argv[1], sys.argv[2] 로 인수를 전달