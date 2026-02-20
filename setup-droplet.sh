#!/bin/bash
# David Rinderknecht Homepage - Automated Droplet Setup

# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js (Version 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git

# 3. Install PM2 globally
npm install -g pm2

# 4. Setup Website Directory
mkdir -p /var/www/daves-homepage
cd /var/www/daves-homepage

# 5. Clone the repository (clean start)
git clone https://github.com/d11dog11/Daves-Homepage.git .
npm install

# 6. Configure Nginx
cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name mylenderdave.com www.mylenderdave.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 7. Restart Nginx
systemctl restart nginx

# 8. Start the App with PM2
pm2 start server.js --name "daves-homepage"
pm2 save
pm2 startup

# 9. Setup Firewall
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "------------------------------------------------"
echo "Setup Complete! Visit http://mylenderdave.com"
echo "------------------------------------------------"
