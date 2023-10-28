FROM python:3.11.5-bookworm
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app
COPY src/ .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
