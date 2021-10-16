#!/bin/sh     
git pull origin main
yarn install
cd client
yarn install
yarn build
cd ../
yarn start
