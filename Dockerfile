FROM node:14-alpine
LABEL version="1.0"

# Install pm2
RUN npm install pm2 -g

WORKDIR /var/opt/coinbase-watch
COPY app/ app
COPY *.js package.json yarn.lock ./

WORKDIR /var/opt/coinbase-watch
RUN ["yarn", "install"]

EXPOSE 3000

ENTRYPOINT ["pm2-runtime", "cbw.config.js"]
