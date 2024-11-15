python -m http.server
kill -9 $(ps -A | grep python | awk '{print $1}')
npm install
npm start
npm cache clean --force
