# Dockerfile for Chatbot Flask microservice
# Uses slim Python base and runs gunicorn

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       git \
       gcc \
       libsndfile1 \
       ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only requirements first for layer caching
COPY requirements.txt /app/requirements.txt

RUN python -m pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r /app/requirements.txt

# Copy source
COPY . /app

# Expose port (use PORT env var at runtime)
ENV PORT=5001
EXPOSE 5001

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-5001} --workers ${WEB_CONCURRENCY:-2} --threads ${GUNICORN_THREADS:-4}"]
