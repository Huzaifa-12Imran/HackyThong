FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install google-genai firebase-admin flask python-dotenv requests flask-cors
EXPOSE 8080
CMD ["python", "backend/app.py"]
