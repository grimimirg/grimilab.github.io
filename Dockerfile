FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY translations/ /usr/share/nginx/html/translations/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
