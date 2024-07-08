SERVER_USER="root";
SERVER_IP="143.198.66.108";
PATH_TO_PROJECT="/Users/ashwinramesh/Projects/travlr";

# https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu#step-10-configure-nginx-to-proxy-pass-to-gunicorn

# TODO - run build and deploy JS

# Build JS
cd $PATH_TO_PROJECT;
cd travlr_js;
npm run build;


# TODO - Run install script (or update script) if requried?



# Copy code to remote server
rsync -avz --exclude 'node_modules' --exclude '*/node_modules' --exclude 'venv' --exclude '*/venv' --exclude '.git' --exclude '.git/*' $PATH_TO_PROJECT $SERVER_USER@$SERVER_IP:/root

# Copy FE code
rsync -avz --exclude 'node_modules' --exclude '*/node_modules' --exclude 'venv' --exclude '*/venv' --exclude '.git' --exclude '.git/*' $PATH_TO_PROJECT/travlr_js/dist $SERVER_USER@$SERVER_IP:/var/www/


ssh "${SERVER_USER}@${SERVER_IP}" << EOF
  chown -R www-data:www-data /var/www/dist/;

  cp /root/travlr/deploy/gunicorn.service /etc/systemd/system/gunicorn.service
  cp /root/travlr/deploy/gunicorn.socket /etc/systemd/system/gunicorn.socket
  cp /root/travlr/deploy/travlr_nginx /etc/nginx/sites-available/travlr_nginx
  sudo ln -s /etc/nginx/sites-available/travlr_nginx /etc/nginx/sites-enabled

  sudo systemctl daemon-reload
  sudo systemctl restart gunicorn.socket
  sudo systemctl enable gunicorn.socket
  sudo systemctl restart nginx
EOF