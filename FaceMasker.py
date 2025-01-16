import cv2
import dlib
import numpy as np

class FaceMasker:
    def __init__(self, predictor_path="Model_Params/shape_predictor_68_face_landmarks.dat"):
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(predictor_path)

    def create_masked_image_versions(self, img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        found_faces = self.detector(gray)
        
        if len(found_faces) != 0:
            primary_face = found_faces[0]
            landmarks = self.predictor(gray, primary_face)
            masked_images = [img]

            masked_images.append(self.blur_part_of_face(img, landmarks, "eyes"))
            masked_images.append(self.blur_part_of_face(img, landmarks, "mouth"))
            masked_images.append(self.blur_part_of_face(img, landmarks, "forehead", primary_face))
        else:
            return [img]

        return masked_images

    def blur_part_of_face(self, img, projected_landmarks_output, part_of_face, face=None):
        image_to_be_masked = img.copy()
        
        if part_of_face == "eyes":
            start_eye_left = (projected_landmarks_output.part(36).x, projected_landmarks_output.part(36).y)
            end_eye_right = (projected_landmarks_output.part(45).x, projected_landmarks_output.part(45).y)
            
            x_start_pos = max(0, start_eye_left[0] - 10)
            x_end_pos = min(image_to_be_masked.shape[1], end_eye_right[0] + 10)
            y_start_pos = max(0, start_eye_left[1] - 15)
            y_end_pos = min(image_to_be_masked.shape[0], end_eye_right[1] + 10)

            self.blur_in_a_rectangle(image_to_be_masked, x_start_pos, y_start_pos, x_end_pos, y_end_pos)

        elif part_of_face == "mouth":
            proj_mouth_region = [(projected_landmarks_output.part(i).x, projected_landmarks_output.part(i).y) for i in range(48, 68)]
            points = np.array(proj_mouth_region, dtype=np.int32)
            x_pos, y_pos, width, height = cv2.boundingRect(points)
            
            y_start_pos = max(0, y_pos - 10)
            y_end_pos = min(image_to_be_masked.shape[0], y_pos + height + 20)
            
            self.blur_in_a_rectangle(image_to_be_masked, x_pos, y_start_pos, x_pos + width, y_end_pos)

        elif part_of_face == "forehead" and face is not None:
            upper_part_of_face = max(0, face.top() - 20)
            left_part_of_face = projected_landmarks_output.part(17).x
            right_part_of_face = projected_landmarks_output.part(26).x
            bottom_y_of_face = projected_landmarks_output.part(27).y

            self.blur_in_a_rectangle(image_to_be_masked, left_part_of_face, upper_part_of_face, right_part_of_face, bottom_y_of_face)

        return image_to_be_masked

    def blur_in_a_region(self, img, positions):
        positions = np.array(positions, dtype=np.int32)
        x_pos, y_pos, blur_width, blur_height = cv2.boundingRect(positions)
        img[y_pos:y_pos+blur_height, x_pos:x_pos+blur_width] = cv2.GaussianBlur(img[y_pos:y_pos+blur_height, x_pos:x_pos+blur_width], (15, 15), 0)

    def blur_in_a_rectangle(self, image, start_x, start_y, end_x, end_y):
        image[start_y:end_y, start_x:end_x] = cv2.GaussianBlur(image[start_y:end_y, start_x:end_x], (15, 15), 0)
