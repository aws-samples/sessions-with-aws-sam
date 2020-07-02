PRODUCT_NAME = SwiftApi
DEPS = libswiftCore.so libswiftGlibc.so libswiftDispatch.so libdispatch.so libBlocksRuntime.so libFoundation.so libicui18nswift.so.65 libicuucswift.so.65 libicudataswift.so.65

DOCKER_NAME = swift-builder-$(PRODUCT_NAME)
TARGET_DIR = ../.aws-sam/build/$(PRODUCT_NAME)
SOURCE = .build
ARTIFACTS_DIR = ../.aws-sam/build/SwiftApi
BUILD_DIR = $(ARTIFACTS_DIR)/../../$(PRODUCT_NAME)-build

build-$(PRODUCT_NAME):
	mkdir -p $(ARTIFACTS_DIR)/../../.build-prod
	# docker run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder swift build --product $(PRODUCT_NAME) -c release --build-path ./.aws-sam/$(PRODUCT_NAME)-build
	docker run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder touch $(ARTIFACTS_DIR)/../../.build-prod/HERE_I_AM.txt
	# docker rm -f $(DOCKER_NAME)
	
build: setup
	docker run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder swift build --product $(PRODUCT_NAME) -c release
	$(foreach dep,$(DEPS),docker cp -L $(DOCKER_NAME):/usr/lib/swift/linux/$(dep) $(TARGET_DIR);)
	docker rm -f $(DOCKER_NAME)
	cp "$(SOURCE)/release/$(PRODUCT_NAME)" "$(TARGET_DIR)/bootstrap"

setup:
	mkdir -p $(TARGET_DIR)