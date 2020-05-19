# lets do this first i want this to based on the 
FROM node:lts

#create worker directory
WORKDIR /usr/src/app

COPY *.json ./

WORKDIR /usr/src/app/lib

COPY ./lib/*.* ./

EXPOSE 3000

