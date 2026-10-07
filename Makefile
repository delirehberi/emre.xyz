.PHONY: dev deploy

dev:
	. $(HOME)/.nvm/nvm.sh && nvm use 22 && npx wrangler pages dev .

deploy:
	. $(HOME)/.nvm/nvm.sh && nvm use 22 && npx wrangler pages deploy .
