# 웹 서버가 아닌 소스코드 도커라이징

from random import randint

# input을 받아야 하므로
# -i : interactive, 입력가능
# -t : tty, 터미널을 생성함

# 본 소스코드를 컨테이너 인스턴스화 하면
# 한번 실행되고 종료됌 
min_number = int(input('Please enter the min number: '))
max_number = int(input('Please enter the max number: '))

if (max_number < min_number): 
  print('Invalid input - shutting down...')
else:
  rnd_number = randint(min_number, max_number)
  print(rnd_number)

