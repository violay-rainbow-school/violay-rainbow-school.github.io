#! /bin/bash

showHelp() {
    if [ $# -eq 0 ]; then
        echo "$(basename $0) googleDriveImageUrl"
        exit
    fi
}

makeGoogleDriveImageUrlFromImageId() {
    echo "https://drive.google.com/uc?export=view&id=$1"
}

makeGoogleDriveImageUrlFromImageLink() {
    imageUrl=$(echo "$1" | sed 's#/view##' | sed 's#?usp=sharing##' | sed 's#/file/d/#/uc?export=view\&id=#')
    echo $imageUrl
}

showHelp $@

if [ ${1:0:4} != 'http' ]; then
    makeGoogleDriveImageUrlFromImageId "$1"
    exit
fi

makeGoogleDriveImageUrlFromImageLink "$1"