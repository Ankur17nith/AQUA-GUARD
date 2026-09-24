FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for GIS & C libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy monorepo code & sample data
COPY apps/api/ apps/api/
COPY data/ data/
COPY ml/ ml/
COPY scripts/ scripts/

ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
