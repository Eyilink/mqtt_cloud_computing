# Use the official Mosquitto image as a parent image
FROM eclipse-mosquitto:latest

# Set the working directory in the container
WORKDIR /mosquitto

# Copy the configuration file(s) from your local machine into the container
COPY ./config /mosquitto/config

# Inform Docker that the container listens on the specified network ports at runtime.
EXPOSE 1883 9001

# Specify the default command to run the broker.
# Here, we use the Mosquitto binary and point it to our custom config file.
# Note: The official image might already set an ENTRYPOINT or CMD for running Mosquitto,
# so this step is optional if your configuration doesn't change how Mosquitto is executed.
CMD ["mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]
