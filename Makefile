.PHONY: build check check-urls check-links-internal check-links-external \
	check-html check-a11y check-budget check-head-tags check-browser \
	format format-check deploy-build clean

PUBLIC := public

build:
	hugo --gc --minify --panicOnWarning --cleanDestinationDir

check-urls:
	tests/check-urls.sh $(PUBLIC)

check-links-internal:
	lychee --offline --root-dir "$(CURDIR)/$(PUBLIC)" $(PUBLIC)

check-links-external:
	lychee --root-dir "$(CURDIR)/$(PUBLIC)" $(PUBLIC) || true

check-html:
	npx html-validate "$(PUBLIC)/**/*.html"

check-a11y:
	node tests/check-a11y.mjs $(PUBLIC)

check-budget:
	node tests/check-budget.mjs $(PUBLIC)

check-head-tags:
	node tests/check-head-tags.mjs $(PUBLIC)

check-browser:
	node tests/browser-check.mjs $(PUBLIC)

format:
	npx prettier --write "**/*.{md,css}"

format-check:
	npx prettier --check "**/*.{md,css}"

# Full suite: everything, including the report-only external link check.
check: build check-urls check-links-internal check-links-external check-html \
	check-a11y check-budget check-head-tags check-browser format-check

deploy-build:
	hugo --gc --minify --cleanDestinationDir
	$(MAKE) check

clean:
	rm -rf $(PUBLIC)
