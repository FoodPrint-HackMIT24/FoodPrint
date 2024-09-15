FROM python:3.12

RUN pip install poetry==1.6.1

RUN mkdir /backend
WORKDIR /backend
COPY ./backend /backend
RUN pip install -r requirements.txt

EXPOSE 8085

CMD uvicorn main:app --host 0.0.0.0 --port 8085 --reload
