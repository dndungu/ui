#!/bin/sh

ROOT=`pwd`
JAR=/usr/local/jar/yuicompressor-2.4.7.jar
CSS=$ROOT"/default-0.0.3.css"
CSSMIN=$ROOT"/default.min-0.0.3.css"
java -jar $JAR $CSS > $CSSMIN

chmod "755" $CSSMIN
