#!/bin/sh

ROOT=`pwd`

JS=$ROOT"/gereji-0.0.2.js"
cp -f $ROOT"/core/gereji.js" $JS
cat $ROOT"/core/gereji.broker.js" >> $JS
cat $ROOT"/core/gereji.sync.js" >> $JS
cat $ROOT"/core/gereji.storage.js" >> $JS
cat $ROOT"/core/gereji.validator.js" >> $JS
cat $ROOT"/core/gereji.transition.js" >> $JS
cat $ROOT"/core/gereji.model.js" >> $JS
cat $ROOT"/core/gereji.collection.js" >> $JS
cat $ROOT"/core/gereji.dom.js" >> $JS
cat $ROOT"/core/gereji.xslt.js" >> $JS
cat $ROOT"/core/gereji.view.js" >> $JS
cat $ROOT"/core/gereji.os.js" >> $JS
cat $ROOT"/apps/events.js" >> $JS
cat $ROOT"/apps/form.js" >> $JS
cat $ROOT"/apps/layout.js" >> $JS
cat $ROOT"/apps/dashboard.js" >> $JS
cat $ROOT"/apps/collapsible.js" >> $JS
cat $ROOT"/apps/draggable.js" >> $JS

chmod "755" $JS
