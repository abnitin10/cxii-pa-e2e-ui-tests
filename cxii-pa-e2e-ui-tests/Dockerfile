# Dockerfile.playwright-java

ARG PLAYWRIGHT_VERSION=1.43.1  # default fallback if not passed during build
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-jammy

# Install OpenJDK 11
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean;

# Verify Java installation
RUN java -version && javac -version

# Optional: Set JAVA_HOME and update PATH
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy test repo contents (optional - may be skipped for CI pipelines)
# COPY . .
