import dlib
import numpy as np
import os
import cv2
from PreProcessor import PreProcessor
from FaceMasker import FaceMasker

class FaceID:
    def __init__(self):
        self.preprocessor = PreProcessor()
        self.masker = FaceMasker()
        self.known_face_encodings = []
        self.known_names = []

        self.face_rec_model = dlib.face_recognition_model_v1("Model_Params/dlib_face_recognition_resnet_model_v1.dat")

    def get_face_encoding(self, image):
        resized_image = cv2.resize(image, (150, 150))
        return np.array(self.face_rec_model.compute_face_descriptor(resized_image))

    def add_face(self, image, name):
        processed_image, success = self.preprocessor.preprocess_image(image=image)
        
        if success != -1:
            if len(processed_image.shape) == 2:
                gray_processed_image = cv2.cvtColor(processed_image, cv2.COLOR_GRAY2RGB)

            masked_images = self.masker.create_masked_image_versions(gray_processed_image)

            for masked_image in masked_images:
                embedded_face_vector = self.get_face_encoding(masked_image)
                if embedded_face_vector is not None:
                    self.known_face_encodings.append(embedded_face_vector)
                    self.known_names.append(name)
                    print(f"Added face for {name} with mask variation.")
                else:
                    print("No face detected in the masked image; skipping.")
        else:
            print("Image preprocessing failed.")

    def inference(self, image_path, tolerance=0.4, img=None):
        if img is None:
            image = cv2.imread(image_path)
        else:
            image = img

        processed_image, success = self.preprocessor.preprocess_image(image=image)
        
        if success != -1:
            if len(processed_image.shape) == 2:
                processed_image = cv2.cvtColor(processed_image, cv2.COLOR_GRAY2RGB)

            unknown_face_encoding = self.get_face_encoding(processed_image)

            if unknown_face_encoding is not None:
                distances = [np.linalg.norm(known_encoding - unknown_face_encoding) for known_encoding in self.known_face_encodings]
                best_match_index = np.argmin(distances)

                if distances[best_match_index] <= tolerance:
                    name = self.known_names[best_match_index]
                    confidence = (1 - distances[best_match_index]) * 100
                else:
                    name = "Unknown"
                    confidence = 0

                return name, confidence
            else:
                return "Unknown", 0
        else:
            return "Unknown", 0

    def save_encodings(self, file_path='Model_Storage/face_encodings.npy'):
        np.save(file_path, {'encodings': self.known_face_encodings, 'names': self.known_names})
        print(f"Model encodings saved to {file_path}.")

    def load_encodings(self, file_path='Model_Storage/face_encodings.npy'):
        if os.path.exists(file_path):
            model_to_be_loaded = np.load(file_path, allow_pickle=True).item()
            self.known_face_encodings = model_to_be_loaded['encodings']
            self.known_names = model_to_be_loaded['names']
            print(f"Model encodings loaded from {file_path}.")
        else:
            print(f"No saved encodings found at {file_path}.")
