### Add functions here and link them to builder-bit format MUST BE "build-FunctionResourceName in template.yaml"

build-Squared: builder-bot
build-SwiftApi: builder-bot

######################  No Change required below this line  ##########################

builder-bot:
	$(eval $@PRODUCT = $(subst build-,,$(MAKECMDGOALS)))
	$(eval $@BUILD_DIR = $(PWD)/.aws-sam/build-$($@PRODUCT))
	$(eval $@STAGE = $($@BUILD_DIR)/lambda)
	$(eval $@ARTIFACTS_DIR = $(PWD)/.aws-sam/build/$($@PRODUCT))
	
	# Create docker file
	# docker build -f Dockerfile . -t builder

	# prep directories
	mkdir -p $($@BUILD_DIR)/lambda $($@ARTIFACTS_DIR)

	# Compile application
	docker run --rm -v $($@BUILD_DIR):/build-target -v `pwd`:/build-src -w /build-src builder bash -cl "swift build --product $($@PRODUCT) -c release --build-path /build-target"

	# copy deps
	-docker run --rm -v $($@BUILD_DIR):/build-target -v `pwd`:/build-src -w /build-src builder bash -cl "ldd '/build-target/release/$($@PRODUCT)' | grep swift | awk '{print $3}' | xargs cp -Lv -t /build-target/lambda"
  
	# copy binary to stage
	cp $($@BUILD_DIR)/release/$($@PRODUCT) $($@BUILD_DIR)/lambda/bootstrap
  
  # copy app from stage to artifacts dir
	cp $($@STAGE)/* $($@ARTIFACTS_DIR)