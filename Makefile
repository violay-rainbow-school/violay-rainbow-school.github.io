SCHOOL_PAPERWORK_PATH = "../school_paperwork"
API_HOST = '127.0.0.1:8002'
HOST = '127.0.0.1:4000'

browse:
	firefox $(HOST)/reservation

browse-api: ## Open the API documentation in a browser
	firefox $(API_HOST)/api

install:
	bundle install

start: start-api serve

serve:
	bundle exec jekyll serve --livereload

start-api:
	cd $(SCHOOL_PAPERWORK_PATH); make start

browse-transparent-classroom-api-documentation:
	firefox https://www.transparentclassroom.com/api