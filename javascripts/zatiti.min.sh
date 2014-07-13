#!/bin/sh

JAR=/usr/local/jar/yuicompressor-2.4.8.jar
ROOT=`pwd`
JS=$ROOT"/src/zatiti-0.0.1.js"
JSMIN=$ROOT"/bin/zatiti.min-0.0.1.js"

java -jar $JAR $JS > $JSMIN

chmod "755" $JSMIN
