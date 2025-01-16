import cv2
import dlib
import numpy as np


class FaceAligner:
    def __init__(self, predictor_path="Model_Params/shape_predictor_68_face_landmarks.dat"):
        self.face_detector_inator = dlib.get_frontal_face_detector()
        self.face_predictor_inator = dlib.shape_predictor(predictor_path)

    def align_face(self, image):
        grayscale_version_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        found_recs = self.face_detector_inator(grayscale_version_image, 1)

        if len(found_recs) > 0:

            predicted_landmarks = self.face_predictor_inator(grayscale_version_image, found_recs[0])

            position_of_left_eye = (predicted_landmarks.part(36).x, predicted_landmarks.part(36).y)
            position_of_right_eye = (predicted_landmarks.part(45).x, predicted_landmarks.part(45).y)

            diff_x = position_of_right_eye[0] - position_of_left_eye[0]
            diff_y = position_of_right_eye[1] - position_of_left_eye[1]
            rotation_angle = np.degrees(np.arctan2(diff_y, diff_x))

            rotation_center = ((position_of_left_eye[0] + position_of_right_eye[0]) // 2, (position_of_left_eye[1] + position_of_right_eye[1]) // 2)

            rotation_matrix_for_face = cv2.getRotationMatrix2D(rotation_center, rotation_angle, scale=1.0)
            fully_aligned_image = cv2.warpAffine(image, rotation_matrix_for_face, (image.shape[1], image.shape[0]), flags=cv2.INTER_CUBIC)

            return fully_aligned_image, 0
        else:
            return image, -1
    

