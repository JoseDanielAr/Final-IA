# Final-IA

# Aplicación Móvil de Detección de Objetos con React Native y FastAPI

Este proyecto consiste en una aplicación móvil desarrollada con **React Native (Expo)** que permite a los usuarios cargar imágenes desde su dispositivo, enviarlas a un servidor backend construido con **FastAPI**, y recibir predicciones de un modelo de detección de objetos basado en YOLOv8 (formato ONNX).

---

# Funcionalidades

- Selección de imágenes desde el almacenamiento local del dispositivo.
- Campo editable para ingresar la dirección IP pública del backend (útil para entornos con direcciones dinámicas, como instancias de laboratorio).
- Botón de envío para procesar la imagen.
- Visualización de resultados, incluyendo nombre de la clase detectada, nivel de confianza y coordenadas del objeto.

---

# Requisitos

Este proyecto hace uso de la sisguientes librerias:


## Frontend (React Native con Expo)

- Node.js y npm: [https://nodejs.org/](https://nodejs.org/)
- Expo CLI:

```bash
npm install -g expo-cli

## Backend (AWS, instancia de Ubuntu)

- Python3.8+
- fastapi, uvicorn, pillow, onnxruntime
