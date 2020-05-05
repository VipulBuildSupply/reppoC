set -x

echo "" > /usr/share/nginx/html/assets/env.js
echo "(function(window) {window.env = {}; " >> /usr/share/nginx/html/assets/env.js
if [ $BUILDSUPPLY_COMMERCE_BASE_API_URL ]
then
  echo '"window.env.api_url" : "'$BUILDSUPPLY_COMMERCE_BASE_API_URL'",' >> /usr/share/nginx/html/assets/env.js
else
echo '"window.env.api_url" : "https://api.yeho.ga/",' >> /usr/share/nginx/html/assets/env.js
fi


echo "window.env.payment_api_url ='"$BUILDSUPPLY_COMMERCE_PAYMENT_API_URL"'" >> /usr/share/nginx/html/assets/env.js 
echo "})(this);"  >> /usr/share/nginx/html/assets/env.js
echo "const oppo = {}; oppo.env.api_url = '"$BUILDSUPPLY_COMMERCE_BASE_API_URL"';" >> /usr/share/nginx/html/assets/env.js
echo "oppo.env.payment_api_url ='"$BUILDSUPPLY_COMMERCE_PAYMENT_API_URL"'" >> /usr/share/nginx/html/assets/env.js

