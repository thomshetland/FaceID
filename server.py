from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
from newFaceID import FaceID
import logging


app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

model_path = 'Model_Storage'
model = FaceID()
model.load_encodings(os.path.join(model_path, 'presentation.npy'))

@app.route('/register', methods=['POST'])
def register():
    try:
        name = request.form.get('name')
        images = request.files.getlist('images[]')

        if not name or not images:
            logger.error("Missing required fields: name or images")
            return jsonify({"error": "Missing required fields"}), 400

        save_path = os.path.join("received_images", name)
        os.makedirs(save_path, exist_ok=True)

        for idx, image in enumerate(images):
            np_img = np.frombuffer(image.read(), np.uint8)
            img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

            if img is None:
                logger.error(f"Image {idx + 1} could not be decoded")
                continue

            image_path = os.path.join(save_path, f"{name}_photo_{idx + 1}.jpg")
            cv2.imwrite(image_path, img)
            logger.info(f"Saved image to {image_path}")

            model.add_face(img, name)

        model.save_encodings(os.path.join(model_path, 'presentation_2.npy'))

        return jsonify({"success": True}), 201

    except Exception as e:
        logger.error(f"Error during registration: {str(e)}", exc_info=True)
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


UPLOAD_FOLDER = 'loginImages'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/faceid', methods=['POST'])
def faceid():
    try:
        logger.debug("Received faceid request")

        if 'image' not in request.files:
            logger.error("No image provided in request")
            return jsonify({"error": "No image provided"}), 400

        try:
            file = request.files['image']
            filename = file.filename
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(save_path)
            logger.debug(f"Image saved to {save_path}")
        except Exception as e:
            logger.error(f"Failed to save image: {str(e)}", exc_info=True)
            return jsonify({"error": "Failed to save image"}), 500

        file_content = open(save_path, 'rb').read()
        np_img = np.frombuffer(file_content, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            logger.error("Failed to decode image")
            return jsonify({"error": "Invalid image format"}), 400

        try:
            logger.debug("Running face recognition")
            name, confidence = model.inference(image_path=save_path)

            if not name:
                return jsonify({"error": "No face detected in the image"}), 404
            if confidence is None:
                return jsonify({"error": "Image preprocessing failed"}), 400

            logger.debug(f"Recognition result: Name={name}, Confidence={confidence}")
            return jsonify({"name": name, "confidence": confidence}), 200

        except Exception as e:
            logger.error(f"Face recognition failed: {str(e)}", exc_info=True)
            return jsonify({"error": f"Face recognition failed: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Server error: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
