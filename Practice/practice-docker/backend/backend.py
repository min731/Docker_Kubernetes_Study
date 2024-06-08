import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)

# 실전에서는 비밀번호 등을 이곳에 입력하지 말 것!
# 환경변수 등을 활용하세요.
app.config['MYSQL_USER'] = 'docker'
app.config['MYSQL_PASSWORD'] = 'docker1234'
app.config['MYSQL_DB'] = 'visitlog'
app.config['MYSQL_HOST'] = os.getenv('DBHOST', 'database')
app.config['MYSQL_PORT'] = 3306  # MySQL의 기본 포트

mysql = MySQL(app)

@app.route('/')
def index():
    return "Backend Server"

@app.route('/visits', methods=['GET'])
def readVisit():
    cur = None
    try:
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM visits''')
        r = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
        return jsonify({'visits': r})
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred'}), 500
    finally:
        if cur:
            try:
                cur.close()
            except MySQLdb.OperationalError as e:
                print(f"OperationalError when closing cursor: {e}")

@app.route('/visits', methods=['POST'])
def writeVisit():
    conn = None
    cursor = None
    try:
        _name = request.json['name']
        if _name and request.method == 'POST':
            sqlQuery = "INSERT INTO visits(visitor_name) VALUES(%s)"
            bindData = (_name,)
            conn = mysql.connection
            cursor = conn.cursor()
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            response = jsonify('Visitor added successfully!')
            response.status_code = 200
            return response
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred'}), 500
    finally:
        if cursor:
            try:
                cursor.close()
            except MySQLdb.OperationalError as e:
                print(f"OperationalError when closing cursor: {e}")
        if conn:
            try:
                conn.close()
            except MySQLdb.OperationalError as e:
                print(f"OperationalError when closing connection: {e}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
