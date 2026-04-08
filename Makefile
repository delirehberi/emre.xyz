.PHONY: deploy

deploy:
	. $(HOME)/.nvm/nvm.sh && nvm use 22 && npx wrangler pages deploy .
