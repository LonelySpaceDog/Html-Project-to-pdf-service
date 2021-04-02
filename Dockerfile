#Well... It works at least on my system :)
FROM debian:latest
SHELL ["/bin/bash", "-c"]
RUN apt-get clean && apt-get update
RUN apt-get install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y wkhtmltopdf
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
COPY . patches/wkhtmltopdf+0.3.4.patch
RUN npm install
COPY . .
EXPOSE 5520
CMD ["node", "src/server.js"]
