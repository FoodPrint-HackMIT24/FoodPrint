#!/bin/bash

docker build -t backend .
docker run -e APP_ENV=development -p 8085:8085 -v $(pwd)/backend -it --env-file ./backend/.env backend
