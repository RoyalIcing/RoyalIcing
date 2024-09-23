production: update
	cd _worker && npx wrangler deploy

update:
	cd _worker && npm update -S

dev:
	cd _worker && npm start

MARKDOWN = $(wildcard **/*.md)

robots.sqlite:
	zig run robots.c -lsqlite3 -- $(MARKDOWN)

echo: **/*.md
	echo $(MARKDOWN)