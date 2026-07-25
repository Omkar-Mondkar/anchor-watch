FROM python:3.12-slim

WORKDIR /agent

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent source
COPY . .

# Non-root user for security
RUN useradd -m -u 1001 agent && chown -R agent:agent /agent
USER agent

# Default: run the collector once (overridden by docker-compose.dev.yml command)
CMD ["python", "collector.py", "--help"]
