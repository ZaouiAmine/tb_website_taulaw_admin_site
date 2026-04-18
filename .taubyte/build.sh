#!/bin/sh

npm install
npm run build
cp -r dist/. /out/
