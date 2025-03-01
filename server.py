from flask import Flask, render_template, request, jsonify
from waitress import serve
from dotenv import load_dotenv
from functions import *

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/ask_data')
def ask_data():
    return render_template('ask_data.html')

@app.route('/submit_confirm', methods=['POST'])
def submit_confirm():
    # Retrieve values from the form
    userInput = request.form.get('userInput')
    extraction_type = request.form.get('extraction_type')  # Ensure this field is included in your form

    # Validate the input if needed
    if not userInput or not userInput.strip():
        return "Please enter a valid input"
    
    # Change the extraction type to boolean
    if extraction_type == 'all_data':
        extraction_type = True
    else:
        extraction_type = False

    # Call your defined functions with the required arguments
    get_user_films(userInput, extraction_type)
    get_user_diary(userInput, extraction_type)

    # Redirect/render the confirmation page
    return render_template('ask_data_confirm.html')

@app.route('/wrapped')
def wrapped():
    return render_template('wrapped.html')

@app.route('/update_data', methods=['POST'])
def submit():
    data = request.get_json()  # Get the JSON payload from the request
    userInput = data['userInput']
    yearWanted = int(data['yearWanted']) 

    # Check for empty strings or string with only spaces
    if not bool(userInput.strip()):
        return "Please enter a valid input"
    
    data = generate_data_wrapped(userInput, yearWanted)
        
    return jsonify(data)

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8000)