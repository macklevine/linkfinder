# deploy.sh
#! /bin/bash

SHA1=$1

# Deploy image to Docker Hub
#docker push movoto/movoto-ng:$SHA1

# Create new Elastic Beanstalk version
S3_BUCKET=movoto-builds
DOCKERRUN_FILE=$SHA1-Dockerrun.aws.json

COMMIT_MESSAGE="$(git --no-pager log --max-count=1 --format=tformat:%aN:\ %s ${SHA1})"

if aws elasticbeanstalk describe-application-versions --version-labels $SHA1 --output text | grep --quiet $SHA1; then
	echo "application version already exists"
else
	echo "creating application version"
	sed "s/<TAG>/$SHA1/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE
	aws s3 cp $DOCKERRUN_FILE s3://$S3_BUCKET/$DOCKERRUN_FILE
	aws elasticbeanstalk create-application-version --application-name "Property Value Service" \
	  --version-label $SHA1 --source-bundle S3Bucket=$S3_BUCKET,S3Key=$DOCKERRUN_FILE \
	  --description "$COMMIT_MESSAGE"
fi

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name propertyvalue-ng \
    --version-label $SHA1
