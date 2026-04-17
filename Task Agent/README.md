# 🧠 Task Planning AI Agent

A fully local AI-powered task prioritization web app built with Python, Flask, and Llama 3.2.
No API keys. No cloud. No cost. Runs 100% on your own machine.

![Task Planning AI Agent](screenshot.png)

---

## 🚀 What It Does

You dump your messy, unorganized tasks in plain English — and the AI instantly converts them into a **clear, prioritized daily schedule** using a P0–P3 priority system.

| Priority | Meaning | Example |
|---|---|---|
| 🔴 P0 | Critical — do immediately | Production bug, urgent client request |
| 🟠 P1 | High — core work | Unblocking teammates, key project tasks |
| 🔵 P2 | Medium — routine | Emails, documentation, meetings |
| 🟢 P3 | Low — nice to have | Learning, reading, long-term planning |

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Python | Core language |
| Flask | Lightweight web server |
| Ollama | Run LLMs locally on your machine |
| Llama 3.2 | The AI brain (by Meta) |
| HTML + CSS + JS | Clean web interface |

---

## 💻 Requirements

- Python 3.8+
- [Ollama](https://ollama.com) installed
- 8GB RAM minimum
- No GPU needed!

---

## ⚙️ Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/taimourkhokhar/aiml-projects.git
cd aiml-projects/Task\ Agent
```

### 2. Install Ollama
Download from [ollama.com](https://ollama.com) and install it.

Then pull the Llama 3.2 model:
```bash
ollama pull llama3.2
```

### 3. Install Python dependencies
```bash
pip install flask ollama
```

### 4. Run the app
```bash
python app.py
```

### 5. Open in browser
```
http://127.0.0.1:5000
```

---

## 🔄 How It Works

```
You type tasks → Flask receives them → System Prompt + tasks sent to Llama 3.2
      → AI returns structured JSON → Flask sends to browser
            → JavaScript renders priority cards on screen
```

1. **System Prompt** — gives the AI clear rules on how to prioritize tasks
2. **Ollama** — runs Llama 3.2 locally, no internet needed
3. **Flask** — acts as the bridge between browser and AI
4. **JSON parsing** — extracts and cleans AI output reliably
5. **Frontend** — displays color-coded priority cards dynamically

---

## 📁 Project Structure

```
Task Agent/
│
├── app.py              # Flask server + AI logic
├── task_agent.py       # Terminal version
├── templates/
│   └── index.html      # Web interface
├── static/
│   ├── style.css       # Dark theme styling
│   └── script.js       # Frontend logic
└── README.md
```

---

## 🎯 Key Learnings

- You don't need expensive API keys to build AI apps
- A well-written **System Prompt** is what makes an AI agent useful
- Setting **temperature=0.1** gives consistent, structured JSON output
- Always wrap JSON parsing in try/except for reliable AI apps

---

## 🔮 What's Next

- [ ] Document Q&A system using RAG + ChromaDB
- [ ] Save and export schedules as PDF
- [ ] Add voice input for tasks

---

## 👤 Author

**Taimour Khokhar**  
Student | AI/ML Engineer  
🔗 [GitHub](https://github.com/taimourkhokhar) | [LinkedIn](https://www.linkedin.com/in/taimourkhokhar)

---

⭐ If you found this useful, please give it a star!
