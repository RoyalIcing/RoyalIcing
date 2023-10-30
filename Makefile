production: update
	cd _worker && npx wrangler deploy

update:
	cd _worker && npm update -S

dev:
	cd _worker && npm start
