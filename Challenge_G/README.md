# Hallo
... und herzlich willkommen zu unserem CTF.
Hier sind 2 Applikationen die mit 
``` docker-compose up ``` 
gebaut werden können.

Hierfür braucht man also Docker installiert auf seinem PC!
Am besten einfach Googlen und über die Docker-Webseite installieren.

### Alternativ: Docker-Installation für WSL
Für diejenigen die nicht lange suchen und WSL(!) - Windows Subsystem for Linux(? xD) haben
haben wir ein sh script zum installieren von Docker:

```
# Install Docker on Ubuntu under WSL2

# Update packages
sudo apt update; sudo apt upgrade

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repo
echo "deb [signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker image
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to Docker group
sudo usermod -aG docker $USER

# Restart WSL in Powershell: wsl --shutdown

# Start/Stop/Remove applications
# docker compose up
# docker compose down
# docker compose down --remove-orphans
# docker ps
# docker stop <containerid>
```
