from flask import Flask, render_template, request, jsonify
import ollama
import json

app = Flask(__name__)

SYSTEM_PROMPT = """
You are an expert productivity AI agent. Your job is to take an unstructured list of tasks
from a professional and convert them into a structured, prioritized daily schedule.

Rules for prioritization:
1. P0 (Critical): Production bugs, urgent client requests, or hard deadlines today.
2. P1 (High): Core project work, unblocking other team members.
3. P2 (Medium): Routine tasks, emails, documentation.
4. P3 (Low): Nice-to-haves, learning, long-term planning.

Output Constraints:
You MUST respond ONLY with valid JSON. Do not include any conversational text,
markdown formatting blocks (like ```json), or explanations.

The JSON schema must match this exact format:
{
  "schedule": [
    {
      "task": "Task name",
      "priority": "P0/P1/P2/P3",
      "estimated_minutes": 30,
      "reasoning": "Brief explanation"
    }
  ]
}
"""

def generate_schedule(user_input):
    response = ollama.chat(
        model='llama3.2',
        messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': user_input}
        ],
        options={'temperature': 0.1}
    )

    raw_output = response['message']['content']

    # Clean output
    clean_output = raw_output.strip()
    if clean_output.startswith("```"):
        clean_output = clean_output.split("```")[1]
        if clean_output.startswith("json"):
            clean_output = clean_output[4:]

    plan = json.loads(clean_output)
    return plan

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    user_input = data.get('tasks', '')

    if not user_input.strip():
        return jsonify({'error': 'Please enter some tasks!'}), 400

    try:
        plan = generate_schedule(user_input)
        return jsonify(plan)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)