import cv2
import numpy as np


class FaceLocator:
    def __init__(self, model_path="Model_Params/deploy.prototxt", weights_path="Model_Params/res10_300x300_ssd_iter_140000_fp16.caffemodel"):
        self.CNN_model = cv2.dnn.readNetFromCaffe(model_path, weights_path)

    def locate_and_crop(self, image):
        (image_height, image_width) = image.shape[:2]
        normalized_blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), (104.0, 177.0, 123.0))

        self.CNN_model.setInput(normalized_blob)
        bound_boxes = self.CNN_model.forward()

        coordinate_of_face = None
        for i in range(0, bound_boxes.shape[2]):
            conf_score = bound_boxes[0, 0, i, 2]
            if 0.5 < conf_score:
                bound_box = bound_boxes[0, 0, i, 3:7] * np.array([image_width, image_height, image_width, image_height])
                (x_start_pos, y_start_pos, x_end_pos, y_end_pos) = bound_box.astype("int")

                x_start_pos = max(0, x_start_pos)
                y_start_pos = max(0, y_start_pos)
                x_end_pos = min(image_width, x_end_pos)
                y_end_pos = min(image_height, y_end_pos)

                coordinate_of_face = (x_start_pos, y_start_pos, x_end_pos, y_end_pos)
                break

        if not coordinate_of_face:
            return None
        else:
            face_image = image[coordinate_of_face[1]:coordinate_of_face[3], coordinate_of_face[0]:coordinate_of_face[2]]
            return face_image
