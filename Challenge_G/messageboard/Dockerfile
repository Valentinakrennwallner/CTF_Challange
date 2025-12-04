# Adapted from https://docs.docker.com/compose/gettingstarted
FROM python:3.14
RUN useradd -m ctfuser
WORKDIR /opt/messageboard

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy decrypt script and encrypted app, then decrypt
COPY flask_internal.py /tmp/flask_internal.py
COPY app.py.enc .
RUN python3 /tmp/flask_internal.py app.py.enc app.py "FLASK_PYMOD_441D4" && \
    rm app.py.enc /tmp/flask_internal.py

# Copy other necessary files
COPY templates/ templates/
COPY data/ data/
RUN chown -R ctfuser:ctfuser /opt/messageboard 
USER ctfuser
EXPOSE 4000
CMD ["python", "app.py"]