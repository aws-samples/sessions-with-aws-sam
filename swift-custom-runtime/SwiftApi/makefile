PRODUCT_NAME = SwiftApi
DEPS = libswiftCore.so libswiftGlibc.so libswiftDispatch.so libdispatch.so libBlocksRuntime.so libFoundation.so libicui18nswift.so.65 libicuucswift.so.65 libicudataswift.so.65

############################ You "shouldn't" need to modify below this line ############################

DOCKER_NAME = swift-builder-$(PRODUCT_NAME)
DOCKER_COMMAND = docker
TARGET = `pwd`/.aws-sam/$(PRODUCT_NAME)-build/release/$(PRODUCT_NAME)

build-$(PRODUCT_NAME):

	# Build package
	$(DOCKER_COMMAND) run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder swift build $(PACKAGE_PATH) --product $(PRODUCT_NAME) -c release --build-path ./.aws-sam/$(PRODUCT_NAME)-build

	# Copies bootstrap file to output
	cp $(TARGET) $(ARTIFACTS_DIR)/bootstrap

	# # Copy dependencies libs
	$(foreach dep,$(DEPS),docker cp -L $(DOCKER_NAME):/usr/lib/swift/linux/$(dep) $(ARTIFACTS_DIR);)

	# remove docker
	docker rm -f $(DOCKER_NAME)
	

build: ARTIFACTS_DIR  = ../.aws-sam/build/$(PRODUCT_NAME)
build: DOCKER_COMMAND = cd ../ && docker
build: PACKAGE_PATH = --package-path ./$(PRODUCT_NAME)
build: TARGET = ../.aws-sam/$(PRODUCT_NAME)-build/release/$(PRODUCT_NAME)
build: build-$(PRODUCT_NAME)
	