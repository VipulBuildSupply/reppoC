set -x

echo "" > /opt/buyer/dist/browser/assets/env.js
echo "(function(window) {window.env = {};window.env.api_url = '"$BUILDSUPPLY_COMMERCE_BASE_API_URL"';" >> /opt/buyer/dist/browser/assets/env.js
echo "window.env.payment_api_url ='"$BUILDSUPPLY_COMMERCE_PAYMENT_API_URL"';" >> /opt/buyer/dist/browser/assets/env.js 
echo "})(this);"  >> /opt/buyer/dist/browser/assets/env.js

WORKDIR /usr/share/nginx/html/