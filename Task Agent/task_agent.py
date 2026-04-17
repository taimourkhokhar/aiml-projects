import ollama
import json

# 1. Agent's Persona and Rules
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

# 2. Your Unstructured Task Input
messy_brain_dump = """
Write your own messy tasks here...
need to finish the report by tomorrow
reply to Ahmed's email about the meeting
fix the login bug on the website
...
"""

# 3. Call the Local LLM
def generate_schedule(user_input):
    print("\nAgent is thinking... (running locally via Ollama)\n")

    response = ollama.chat(
        model='llama3.2',
        messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': user_input}
        ],
        options={'temperature': 0.1}
    )

    # 4. Extract and Parse the JSON
    raw_output = response['message']['content']

    try:
        # Clean the output - remove markdown backticks if model added them
        clean_output = raw_output.strip()
        if clean_output.startswith("```"):
            clean_output = clean_output.split("```")[1]
            if clean_output.startswith("json"):
                clean_output = clean_output[4:]

        plan = json.loads(clean_output)

        print("\nYOUR OPTIMIZED SCHEDULE:")
        print("-" * 40)
        for item in plan.get('schedule', []):
            print(f"[{item['priority']}] {item['task']} ({item['estimated_minutes']} min)")
            print(f"    -> {item['reasoning']}\n")
    except json.JSONDecodeError as e:
        print(f"JSON Error: {e}")
        print("Raw output was:")
        print(raw_output)

# 5. Run
if __name__ == "__main__":
    generate_schedule(messy_brain_dump)