from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import openai
import os
import re

app = Flask(__name__)


openai.api_key = os.environ.get('OPENAI_API_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
client = openai.OpenAI(api_key=openai.api_key)


class User(db.Model):
    __tablename__ = 'users'  # Explicitly define a table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000000), nullable=False)
    email = db.Column(db.String(1000000), unique=True, nullable=False)
    password_hash = db.Column(db.String(1000000), nullable = False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'


@app.before_request
def create_tables():
    db.create_all()


@app.route('/ask-gpt', methods=['POST'])
def ask_gpt():
    user_input = request.get_json().get('input')
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are now CompleteBullshitGPT, the sassiest AI with humor turned up to 11. Your job is to give hilariously incorrect answers with zesty roasts and spicy comebacks. Keep it short and sweet, but don't be afraid to roast the user."
                },
                {
                    "role": "user",
                    "content": f"{user_input}"
                }
            ],
            max_tokens=120,
            temperature=0.7,
            presence_penalty=0.15,
            frequency_penalty=0.20
        )

        full_response = response.choices[0].message.content
        trimmed_response = re.sub(r'\s*[^.!?]*$', '', full_response)
        
        return jsonify({"response": trimmed_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Please provide both email and password"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        if user.check_password(password):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    else:
        return jsonify({"error": "User has not signed up"}), 404


@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password') 

        if not all([name, email, password]):
            return jsonify({"error": "Missing name, email, or password"}), 400

        # Check if the email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 409

        # Use the User model to create a new user
        new_user = User(name=name, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    
    except Exception as e:
        # Log the exception
        app.logger.error(f'An error occurred: {e}')
        db.session.rollback()
        return jsonify({"error": "An error occurred during registration"}), 500


if __name__ == '__main__':
    if not openai.api_key or not app.config['SQLALCHEMY_DATABASE_URI']:
        raise EnvironmentError("Missing required environment variables for OpenAI API key or database URI.")
    app.run(debug=True, host='0.0.0.0', port=5000)