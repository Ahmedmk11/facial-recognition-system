import base64
import cv2
import numpy as np
import dlib

def count_faces(image_base64):
    face_detector = dlib.get_frontal_face_detector()
    image_bytes = base64.b64decode(image_base64)
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    faces = face_detector(image)
    return len(faces)