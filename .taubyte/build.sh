#!/bin/bash

npm i
npm audit fix -f
npm run build && mv dist/template/* /out
