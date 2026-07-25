FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/configguard.conf /etc/nginx/conf.d/configguard.conf

# Create ssl directory (cert mounted at runtime in prod)
RUN mkdir -p /etc/nginx/ssl

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
