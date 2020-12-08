#! /bin/bash

## Make a usable link from google drive files links or identifiers.

showHelp() {
    if [ $# -eq 0 ]; then
        echo "$(basename $0) googleDriveImageUrlOrIdentifier anotherGoogleDriveImageUrlOrIdentifier"
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

for link in $@; do
    if [ ${link:0:4} != 'http' ]; then
        makeGoogleDriveImageUrlFromImageId "$link"
        continue
    fi
    
    makeGoogleDriveImageUrlFromImageLink "$link"
done