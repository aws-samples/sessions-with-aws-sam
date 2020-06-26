PRODUCT_NAME = SwiftApi
DEPS = libswiftCore.so libswiftGlibc.so libswiftDispatch.so libdispatch.so libBlocksRuntime.so libFoundation.so libicui18nswift.so.65 libicuucswift.so.65 libicudataswift.so.65

############################ You "shouldn't" need to modify below this line ############################

DOCKER_NAME = swift-builder-$(PRODUCT_NAME)
BUILD_DIR = $(ARTIFACTS_DIR)/../../$(PRODUCT_NAME)-build
DOCKER_COMMAND = docker

build-$(PRODUCT_NAME):
	mkdir -p $(BUILD_DIR)

	# Build package
	$(DOCKER_COMMAND) run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder swift build $(PACKAGE_PATH) --product $(PRODUCT_NAME) -c release --build-path ./.aws-sam/$(PRODUCT_NAME)-build

	# Copy dependencies libs
	$(foreach dep,$(DEPS),docker cp -L $(DOCKER_NAME):/usr/lib/swift/linux/$(dep) $(ARTIFACTS_DIR);)

	# remove docker
	docker rm -f $(DOCKER_NAME)

	# copy bootstrap over
	cp "$(BUILD_DIR)/release/$(PRODUCT_NAME)" "$(ARTIFACTS_DIR)/bootstrap"
	

build: ARTIFACTS_DIR  = ../.aws-sam/build/$(PRODUCT_NAME)
build: DOCKER_COMMAND = cd ../ && docker
build: PACKAGE_PATH = --package-path ./$(PRODUCT_NAME)
build: build-$(PRODUCT_NAME)
	