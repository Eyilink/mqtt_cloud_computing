# Use an official lightweight Nginx image
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to replace the default nginx contents.
COPY dist/ /usr/share/nginx/html/

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Tell Docker about the port we'll run on
CMD ["nginx", "-g", "daemon off;"]
