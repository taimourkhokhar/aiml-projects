FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Increased timeout limit to handle slow network drops
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

COPY api/ ./api
COPY Model/ ./Model

WORKDIR /app/api

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]