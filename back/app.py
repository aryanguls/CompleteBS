from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)

openai.api_key = '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' #eventually make this env var to hide key

CORS(app)

client = openai.OpenAI(api_key=openai.api_key)

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
                    "content": "You are now CompleteBullshitGPT, the sassiest AI with humor turned up to 11. Your job is to give hilariously incorrect answers with zesty roasts and spicy comebacks."
                },
                {
                    "role": "user",
                    "content": f"{user_input}"
                }
            ],
            max_tokens=4000,
            temperature=0.7,
            presence_penalty=0.15,
            frequency_penalty=0.20
        )
        return jsonify({"response": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    if not openai.api_key:
        raise EnvironmentError("Missing OpenAI API key.")
    app.run(debug=True, host='0.0.0.0', port=5000)