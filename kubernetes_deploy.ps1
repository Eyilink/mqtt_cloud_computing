# Start Minikube
minikube start

# Check if Minikube started successfully
if ($?) {
    Write-Output "Minikube started successfully."
    
    # Apply Kubernetes configurations for Mosquitto
    kubectl apply -k ./kubernetes/mosquitto
    if ($?) {
        Write-Output "Applied Mosquitto configurations successfully."
    }
    else {
        Write-Output "Failed to apply Mosquitto configurations."
        exit 1
    }

    # Apply Kubernetes configurations for the web application
    kubectl apply -f ./kubernetes_web_app/deployment.yaml
    kubectl apply -f ./kubernetes_web_app/service.yaml
    if ($?) {
        Write-Output "Applied web application configurations successfully."
    }
    else {
        Write-Output "Failed to apply web application configurations."
        exit 1
    }
    kubectl apply -f ./mqtt_broker/kubernetes_web_broker/deployment.yaml
    kubectl apply -f ./mqtt_broker/kubernetes_web_broker/service.yaml
    if ($?) {
        Write-Output "Applied web application for smartphone configurations successfully."
    }
    else {
        Write-Output "Failed to apply web application for smartphone configurations."
        exit 1
    }
}
else {
    Write-Output "Failed to start Minikube."
    exit 1
}
minikube tunnel
