THIS_FILE := $(lastword $(MAKEFILE_LIST))

post:
	./cli/Main.jl --markdown $(FILE)
	@$(MAKE) -f $(THIS_FILE) sitemap

sitemap:
	./cli/Main.jl --sitemap posts
