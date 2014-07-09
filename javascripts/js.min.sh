#!/bin/sh

JAR=/usr/local/jar/yuicompressor-2.4.8.jar
ROOT=`pwd`
JS=$ROOT"/gereji-0.0.2.js"
JSMIN=$ROOT"/gereji.min-0.0.2.js"

java -jar $JAR $JS > $JSMIN

chmod "755" $JSMIN
