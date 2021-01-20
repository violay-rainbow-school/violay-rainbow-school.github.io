SCHOOL_PAPERWORK_PATH = "../school_paperwork"

browse:
	firefox http://127.0.0.1:4000

start: start-api serve

serve:
	bundle exec jekyll serve --livereload

start-api:
	cd $(SCHOOL_PAPERWORK_PATH); make start

open_transparent_classroom_api_documentation:
	firefox https://www.transparentclassroom.com/api