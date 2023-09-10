# ---------------------------------------
# Imports & Initialization
# ---------------------------------------

import os
from flask import Flask, request, jsonify, session, send_from_directory
from flask_session import Session
from flask_cors import CORS
import mysql.connector

app = Flask(__name__, static_folder='../dist')
CORS(app, origins="http://127.0.0.1:5174")

# ---------------------------------------
# Database
# ---------------------------------------

def create_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password= os.environ.get('DATABASE_PASSWORD'),
        database='xceed'
    )
    return connection

# ---------------------------------------
# Session
# ---------------------------------------

app.config['SESSION_TYPE'] = 'filesystem'  # Example: Store sessions on the filesystem
app.config['SESSION_PERMANENT'] = False  # Whether the session should expire on browser close
app.config['SESSION_USE_SIGNER'] = True  # Sign session cookies for security (optional)
app.config['SESSION_KEY_PREFIX'] = 'xfrs_'  # Prefix for session keys (optional)

app.secret_key = os.environ.get('SECRET_KEY')
api_key = os.environ.get('API_KEY')
debug_mode = os.environ.get('DEBUG')

if debug_mode and debug_mode.lower() == 'true':
    app.debug = True

Session(app)

# ---------------------------------------
# POST requests
# ---------------------------------------

@app.route('/login', methods=['GET', 'POST'])
def login():
    return True
    # if request.method == 'POST':
    #     username = request.form['username']
    #     password = request.form['password']

    #     # Check if the provided username exists in the user database
    #     if username in users and users[username] == password:
    #         # Authentication successful, set session variables
    #         session['user_id'] = username
    #         return redirect(url_for('dashboard'))
    #     else:
    #         error = 'Invalid username or password. Please try again.'

    # return render_template('login.html', error=error if 'error' in locals() 

@app.route('/register', methods=['POST'])
def register():
    # Register user and return a JSON response
    # Example: return jsonify({'message': 'Registration successful'})
    return jsonify({'message': 'Registration successful'})

# ---------------------------------------
# GET requests
# ---------------------------------------

@app.route('/home', methods=['GET'])
def index():
    # You can optionally pass data to your HTML page here
    return app.send_static_file('index.html')

@app.route('/', methods=['GET'])
def get_data():
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Execute SQL query to fetch data
    query = "SELECT * FROM User"
    cursor.execute(query)

    # Fetch all rows as a list of dictionaries
    data = cursor.fetchall()

    # Close cursor and connection
    cursor.close()
    connection.close()

    # Return the data as JSON
    return jsonify(data)

# ---------------------------------------

if __name__ == '__main__':
    app.run(debug=True, port=8080)
