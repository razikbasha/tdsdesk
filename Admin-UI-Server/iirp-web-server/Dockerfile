
FROM ubuntu:16.04

# Create iirp-app directory
WORKDIR app


RUN apt-get update && apt-get install -y apt-utils
RUN apt-get install -y build-essential
RUN apt-get install -y dialog apt-utils
RUN apt-get install --yes curl && curl --silent -- location https://deb.nodesource.com/setup_8.x | bash

# copy our static linked library
COPY . .

# tell we are exposing our service on port 8080
EXPOSE 8080

# run it!
CMD ["./main"]  

