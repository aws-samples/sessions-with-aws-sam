# // Permission is hereby granted, free of charge, to any person obtaining a copy of this
# // software and associated documentation files (the "Software"), to deal in the Software
# // without restriction, including without limitation the rights to use, copy, modify,
# // merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
# // permit persons to whom the Software is furnished to do so.
# // //
# // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
# // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
# // PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# // SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## This file is imported by each Lambda makefile.
DOCKER_NAME = swift-builder-$(PRODUCT_NAME)
TARGET_PATH = .sam-build

build: ARTIFACTS_DIR = ../.aws-sam/build/$(PRODUCT_NAME)
build: TARGET_PATH = .build
build: prep build-$(PRODUCT_NAME)


build-$(PRODUCT_NAME):
	# Create artifacts direxctory if not exists
	mkdir -p $(ARTIFACTS_DIR)

	# Run swift build via Amazon linux docker container
	docker run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder swift build --product $(PRODUCT_NAME) -c release --build-path $(TARGET_PATH)

	# copy app dependencies
	$(foreach dep,$(DEPS),docker cp -L $(DOCKER_NAME):/usr/lib/swift/linux/$(dep) $(ARTIFACTS_DIR);)

	# delete docker image
	docker rm -f $(DOCKER_NAME)

	# copy binary
	cp ./.build/release/$(PRODUCT_NAME) $(ARTIFACTS_DIR)/bootstrap

prep:
	mkdir -p $(ARTIFACTS_DIR)
	cp ../template.yaml ../.aws-sam/build