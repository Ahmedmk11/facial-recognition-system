# ---------------------------------------
# Imports & Initialization
# ---------------------------------------

from datetime import datetime
import os
from typing import *
from flask import Flask, make_response, redirect, request, jsonify, session, send_from_directory, url_for
from flask_cors import CORS
from mysql.connector.connection import MySQLConnection

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

def get_data(query: str) -> Dict[str, Any]:
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(query)

    data = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(data)
    
import mysql.connector

def call_insert_procedure(
    procedure_name: str,
    *params: str
):
    """
    Calls an SQL insert procedure with the provided parameters.

    Args:
        procedure_name (str): The name of the SQL insert procedure.
        params (str): Parameter values as individual strings.

    Returns:
        int: The last inserted row's ID (auto-increment primary key).
    """
    try:
        connection = create_db_connection()
        cursor = connection.cursor()

        # Create an OUT parameter variable to capture the result
        out_param = 0  # Initialize with a default value

        params_string = ', '.join(['%s' for _ in params])
        # Include the OUT parameter as the last parameter
        cursor.callproc(procedure_name, params + (out_param,))

        # Fetch the OUT parameter value
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

    conn = create_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM User WHERE username = %s', (username,))
    queryResult = cursor.fetchone()

    cursor.close()
    conn.close()

    if not queryResult:
        return jsonify({'message': f'We couldn\'t find an account with username: {username}'}), 404

    # Store user data in the session
    session['user'] = {
        'user_id': queryResult[0],
        'username': queryResult[4],
        'email': queryResult[3],
        'firstname': queryResult[1],
        'lastname': queryResult[2]
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
    
    conn = create_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM User WHERE email = %s', (email,))
    count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    if count != 0:
        return jsonify({'emailInUse': True})
    
    return jsonify({'emailInUse': False})

@app.route('/api/check-username', methods=['GET'])
def check_username():
    username = request.args.get('username')
    
    if not username:
        return jsonify({'usernameInUse': False})
    
    conn = create_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM User WHERE username = %s', (username,))
    count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    if count != 0:
        return jsonify({'usernameInUse': True})
    
    return jsonify({'usernameInUse': False})

@app.route('/api/check-number', methods=['GET'])
def check_number():
    number = request.args.get('number')
    
    if not number:
        return jsonify({'numberInUse': False})
    
    conn = create_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM User WHERE phone_number = %s', (number,))
    count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    if count != 0:
        return jsonify({'numberInUse': True})
    
    return jsonify({'numberInUse': False})

@app.route('/api/check-username-exists', methods=['GET'])
def check_username_exists():
    username = request.args.get('username')
    
    if not username:
        return jsonify({'username_exists': False})
    
    conn = create_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM User WHERE username = %s', (username,))
    count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    if count != 0:
        return jsonify({'username_exists': True})
    
    return jsonify({'username_exists': False})

# ---------------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=5000)
