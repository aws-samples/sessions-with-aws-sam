PRODUCT_NAME = SwiftApi
DEPS = libswiftCore.so libswiftGlibc.so libswiftDispatch.so libdispatch.so libBlocksRuntime.so libFoundation.so libicui18nswift.so.65 libicuucswift.so.65 libicudataswift.so.65

#################### Do not change below this line ##########################
DOCKER_NAME = swift-builder-$(PRODUCT_NAME)
TARGET_PATH = .sam-build

build: ARTIFACTS_DIR = ../.aws-sam/build/$(PRODUCT_NAME)
build: TARGET_PATH = .build
build: build-$(PRODUCT_NAME)


build-$(PRODUCT_NAME):
	# Create artifacts direxctory if not exists
	mkdir -p $(ARTIFACTS_DIR)

	# Run swift build via AL docker container
	docker run --name $(DOCKER_NAME) -v `pwd`:`pwd` -w `pwd` -i -t swift-lambda-builder swift build --product $(PRODUCT_NAME) -c release --build-path $(TARGET_PATH)

	# copt app dependencies
	$(foreach dep,$(DEPS),docker cp -L $(DOCKER_NAME):/usr/lib/swift/linux/$(dep) $(ARTIFACTS_DIR);)

	# delete docker image
	docker rm -f $(DOCKER_NAME)

	# copy binary
	cp ./.build/release/$(PRODUCT_NAME) $(ARTIFACTS_DIR)/bootstrap
