# lets do this first i want this to based on the 
FROM node:lts
ENV REPOS=cars,planes,trains
ENV DBName=Repository
#create worker directory
WORKDIR /usr/src/app/lib

COPY ./lib/ ./

WORKDIR /usr/src/app

COPY *.json ./

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]

