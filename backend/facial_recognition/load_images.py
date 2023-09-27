import base64
import cv2
import numpy as np

def load_known_images(known_images_base64):
    known_images = []
    
    for base64_image in known_images_base64:
        image_bytes = base64.b64decode(base64_image)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        dlib_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        known_images.append(dlib_image)
    
    return known_images