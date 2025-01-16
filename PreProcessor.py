from FaceAligner import FaceAligner
from FaceLocator import FaceLocator
import cv2

class PreProcessor:
    def __init__(self):
        self.aligner = FaceAligner()
        self.locator = FaceLocator()
        self.target_size = (128, 128)

    def preprocess_image(self, image):
        aligned_image, success = self.aligner.align_face(image)
        cropped_image = self.locator.locate_and_crop(aligned_image)

        if cropped_image is None:
            success = -1
            return image, success
        gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, self.target_size)

        return resized, success


