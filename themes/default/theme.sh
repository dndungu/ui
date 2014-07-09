#!/bin/sh

ROOT=`pwd`
CSS=$ROOT"/default-0.0.2.css"

cp -f $ROOT"/common.css" $CSS

cat $ROOT"/grid.css" >> $CSS
cat $ROOT"/layout.css" >> $CSS
cat $ROOT"/typography.css" >> $CSS
cat $ROOT"/nav.css" >> $CSS
cat $ROOT"/nav-vertical.css" >> $CSS
cat $ROOT"/form.css" >> $CSS

chmod "755" $CSS
