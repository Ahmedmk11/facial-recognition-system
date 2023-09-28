import base64
import cv2
import numpy as np
from facial_recognition.load_images import load_known_images
from facial_recognition.compute_embeddings import compute_face_embeddings

def find_matches(test_image_base64, known_images_base64):
    known_images = load_known_images(known_images_base64)
    test_image_bytes = base64.b64decode(test_image_base64)
    nparr = np.frombuffer(test_image_bytes, np.uint8)
    test_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    test_embeddings = compute_face_embeddings([test_image])
    known_embeddings = compute_face_embeddings(known_images)
    
    for i, test_embedding in enumerate(test_embeddings):
        for j, known_embedding in enumerate(known_embeddings):
            distance = np.linalg.norm(np.array(test_embedding) - np.array(known_embedding))
            if distance < 0.4:
                return True
            else:
                return False
