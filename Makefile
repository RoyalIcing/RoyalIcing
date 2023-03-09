publish: update
	cd _worker && npx wrangler publish

update:
	cd _worker && npm update -S

dev:
	cd _worker && npm start
