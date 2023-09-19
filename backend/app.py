# ---------------------------------------
# Imports & Initialization
# ---------------------------------------

from datetime import datetime
import os
from typing import *
from flask import Flask, make_response, redirect, request, jsonify, session, send_from_directory, url_for
from flask_cors import CORS
from mysql.connector.connection import MySQLConnection
import mysql.connector

app = Flask(__name__, static_folder='../dist')
CORS(app, origins="http://127.0.0.1:5173", supports_credentials=True)

# ---------------------------------------
# Database
# ---------------------------------------

def create_db_connection() -> MySQLConnection:
    connection = MySQLConnection(
        host='localhost',
        user='root',
        password= os.environ.get('DATABASE_PASSWORD'),
        database='xceed'
    )
    return connection

def call_procedure(procedure_name: str, *params: str):
    # Connect to the database
    conn = create_db_connection()

    # Create a cursor
    cursor = conn.cursor()

    # Call the stored procedure
    cursor.callproc(procedure_name, params)

    # Use stored_results to get the result set
    results = cursor.stored_results()
    
    # Fetch each result set
    result_sets = []
    for result in results:
        result_sets.append(result.fetchall())

    # Close the cursor and connection
    cursor.close()
    conn.close()

    # Print the results for debugging
    for result_set in result_sets:
        print(result_set)

    return result_sets


def get_data(query: str) -> Dict[str, Any]:
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(query)

    data = cursor.fetchall()

    cursor.close()
    connection.close()

    return data

def call_insert_procedure(
    procedure_name: str,
    *params: str
):
    try:
        connection = create_db_connection()
        cursor = connection.cursor()

        out_param = 0

        params_string = ', '.join(['%s' for _ in params])
        cursor.callproc(procedure_name, params + (out_param,))

        cursor.execute("SELECT @last_inserted_id")
        last_inserted_id = cursor.fetchone()[0]

        connection.commit()
        return last_inserted_id

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        connection.rollback()
        return -1
    finally:
        cursor.close()
        connection.close()


# ---------------------------------------
# Session
# ---------------------------------------

app.config['SESSION_TYPE'] = 'cookie'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'xfrs_'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
api_key = os.environ.get('API_KEY')
debug_mode = os.environ.get('DEBUG')

if debug_mode and debug_mode.lower() == 'true':
    app.debug = True

# ---------------------------------------
# POST requests
# ---------------------------------------

@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json()
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        username = data.get('username')
        street_address = data.get('street_address')
        city = data.get('city')
        country = data.get('country')
        phone_number = data.get('phone_number')

        date_format = '%Y-%m-%dT%H:%M:%S.%fZ'
        parsed_date = datetime.strptime(data.get('birthdate'), date_format)
        birthdate = parsed_date.date()

        if not (firstname and lastname and username and email and street_address and city and country and phone_number and birthdate):
            error_response = {'error': 'Invalid or missing data'}
            return jsonify(error_response), 400

        procedure_name = "InsertUser"
        params = (firstname, lastname, email, username, street_address, city, country, phone_number, birthdate)
        inserted_id = call_insert_procedure(procedure_name, *params)

        if inserted_id != -1:
            session['user'] = {
                'user_id': inserted_id,
                'username': username,
                'email': email,
                'firstname': firstname,
                'lastname': lastname
            }
            print(f"Data inserted successfully. Inserted ID: {inserted_id}")
            response_data = {'message': 'Registration successful'}
            return jsonify(response_data), 200
        else:
            error_response = {'error': 'Failed to insert data'}
            return jsonify(error_response), 500  # You can use a more appropriate HTTP status code

    else:
        error_response = {'error': 'Invalid request format'}
        return jsonify(error_response), 400

@app.route('/login', methods=['POST'])
def login():
    if request.is_json:
        data = request.get_json()
        username = data.get('username')
    if not (username):
        error_response = {'error': 'Invalid or missing data'}
        return jsonify(error_response), 400

    queryResult = call_procedure('GetAllUsersByUsername', username)

    if not queryResult:
        return jsonify({'message': f'We couldn\'t find an account with username: {username}'}), 404

    # Store user data in the session
    print('q', queryResult)
    session['user'] = {
        'user_id': queryResult[0][0][0],
        'username': queryResult[0][0][4],
        'email': queryResult[0][0][3],
        'firstname': queryResult[0][0][1],
        'lastname': queryResult[0][0][2]
    }
    print(session.get('user'))
    return jsonify({'message': 'Login successful'})

@app.route('/clear-session-user', methods=['POST'])
def clear_session_user():
    print(session)
    try:
        session.clear()
        print(session)
        return jsonify({'message': 'Session cleared successfully'}), 200
    except:
        return jsonify({'message': 'Error clearing session'}), 500
    
# ---------------------------------------
# GET requests
# ---------------------------------------

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user' in session:
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False})
    
@app.route('/api/check-email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    
    if not email:
        return jsonify({'emailInUse': False})
    
    count = call_procedure('GetEmailCount' , email)
    if count[0][0][0] != 0:
        return jsonify({'emailInUse': True})
    
    return jsonify({'emailInUse': False})

@app.route('/api/check-username', methods=['GET'])
def check_username():
    username = request.args.get('username')
    
    if not username:
        return jsonify({'usernameInUse': False})

    count = call_procedure('GetUsernameCount', username)

    if count[0][0][0] != 0:
        return jsonify({'usernameInUse': True})
    
    return jsonify({'usernameInUse': False})

@app.route('/api/check-number', methods=['GET'])
def check_number():
    number = request.args.get('number')
    
    if not number:
        return jsonify({'numberInUse': False})
    
    count = call_procedure('GetPhoneNumberCount', number)
    if count[0][0][0] != 0:
        return jsonify({'numberInUse': True})
    
    return jsonify({'numberInUse': False})

@app.route('/api/check-username-exists', methods=['GET'])
def check_username_exists():
    username = request.args.get('username')
    
    if not username:
        return jsonify({'username_exists': False})

    count = call_procedure('GetUsernameCount' ,username)
    print('ccc', count)
    if count != 0:
        return jsonify({'username_exists': True})
    
    return jsonify({'username_exists': False})

@app.route('/api/check-role', methods=['GET'])
def check_role():
    uid = session['user']['user_id']
    if not uid:
        return jsonify({'error': 'No user found'})
    
    role = call_procedure('GetUserRole' ,uid)
    print('role', role[0][0][0])
    if not role:
        return jsonify({'error': 'No role found'})
    
    return jsonify({'role': role[0][0][0]})

@app.route('/api/check-name-site', methods=['GET'])
def check_name_site():
    uid = request.args.get('uid')
    if uid == '':
        uid = session['user']['user_id']
    
    if not uid:
        return jsonify({'error': 'No user found'})
        
    
    [[nameAndSite]] = call_procedure('GetUserDepartmentAndSite' ,uid)
    print(nameAndSite)
    return jsonify({'nameAndSite': nameAndSite})

@app.route('/api/get-all-users', methods=['GET'])
def get_users():
    [users] = call_procedure('GetAllUsers')
    print(users)
    return jsonify({'users': users})

@app.route('/api/get-all-departments', methods=['GET'])
def get_departments():
    [departments] = call_procedure('GetAllDepartments')
    print(departments)
    return jsonify({'departments': departments})

# ---------------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=5000)
