README_MD:=README.md
HBS_STAGING:=staging
JS_FILES_HBS:=$(patsubst $(SRC)/%, $(HBS_STAGING)/%, $(SDLC_ALL_NON_TEST_JS_FILES_SRC))
README_MD_SRC:=$(shell find $(SRC)/docs -name "*.md") $(JS_FILES_HBS)
BUILD_TARGETS+=$(README_MD)

$(JS_FILES_HBS): $(HBS_STAGING)/% : $(SRC)/%
	mkdir -p $(dir $@)
	npx hbs -P '$(SRC)/docs/**/*.hbs' -o $(dir $@) -e $(patsubst .%, %, $(suffix $@)) -- $<

# I'd like to do something like this because processing each file individually is slow, but HBS doesn't maintain the 
# relative paths, so all the files get written directly to the output dir
#$(JS_FILES_HBS) &: $(SDLC_ALL_NON_TEST_JS_FILES_SRC)
#	mkdir -p $(HBS_STAGING)
#	npx hbs -P '$(SRC)/docs/**/*.hbs' -o $(HBS_STAGING) -e 'mjs' -- src/**/*.mjs

$(README_MD): $(README_MD_SRC) jsdoc.config.json .jsdoc2md.json
	cp $(SRC)/docs/README.01.md $@
	npx jsdoc2md \
	  --configure ./jsdoc.config.json \
	  --files '$(HBS_STAGING)/**/*' \
	  --global-index-format grouped \
	  --name-format \
	  --plugin dmd-readme-api \
	  --plugin @liquid-labs/dmd \
	  --clever-links \
	  --no-cache \
	  >> $@
	cat $(SRC)/docs/README.02.md >> $@