import cv2
from cv2 import threshold
import dlib
import os
import base64
import numpy as np

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, '../data/dlib_face_recognition_resnet_model_v1.dat')
face_recognizer = dlib.face_recognition_model_v1(model_path)

# Base64-encoded JPEG images
known_images_base64 = [
    '''data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
        9TXL0Y4OHwAAAABJRRRRU5ErkJggg==''',
    '''data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
        9TXL0Y4OHwAAAABJRRRRU5ErkJggg=='''
]

# Decode base64 and convert to dlib RGB images
known_images = []
for base64_image in known_images_base64:
    image_bytes = base64.b64decode(base64_image)
    if len(image_bytes) > 0:
        print(image_bytes)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        dlib_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        known_images.append(dlib_image)

# Compute the face embeddings for known individuals
known_embeddings = []
for image in known_images:
    embedding = face_recognizer.compute_face_descriptor(image)
    known_embeddings.append(embedding)

# Load the test image, decode it from base64, and compute its face embedding
test_image_base64 = 'base64_encoded_test_image'
test_image_bytes = base64.b64decode(test_image_base64)
test_image_nparr = np.frombuffer(test_image_bytes, np.uint8)
test_image = cv2.imdecode(test_image_nparr, cv2.IMREAD_COLOR)
test_dlib_image = dlib.cvtColor(test_image, dlib.COLOR_BGR2RGB)
test_embedding = face_recognizer.compute_face_descriptor(test_dlib_image)

# Set a distance threshold (you need to define an appropriate threshold)
threshold = 0.6

# Compare the test embedding with known embeddings
for i, known_embedding in enumerate(known_embeddings):
    distance = dlib.distance(test_embedding, known_embedding)
    if distance < threshold:
        print(f"Match found with person {i+1}!")

# You can adjust the threshold to control the matching sensitivity
