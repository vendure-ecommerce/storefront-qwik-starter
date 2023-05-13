#!/bin/sh
git config --global --add safe.directory /workspaces/storefront-qwik-starter
pnpm install
git clone https://github.com/vendure-ecommerce/one-click-deploy.git
cd one-click-deploy && yarn
mv .env.example .env &> /dev/null
sudo update-rc.d postgresql enable
sudo service postgresql start
sudo usermod -aG sudo postgres
sudo -u postgres psql -c "CREATE DATABASE vendure;"
sudo -u postgres psql -c "CREATE user admin with password 'secret';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vendure to admin;"
cd .. && pnpm develop
