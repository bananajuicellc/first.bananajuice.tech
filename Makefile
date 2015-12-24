all: chrome

clean:
	rm -rf build/www

chrome:
	mkdir -p build/www
	cp -r src/_locales build/www
	cp -r src/assets build/www
	cp -r src/bower_components build/www
	cp -r src/*.js build/www
	cp -r src/*.json build/www
	cp -r src/index.html build/www
	cp -r src/index.css build/www
