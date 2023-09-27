import base64
import os
import cv2
import dlib
import numpy as np



# Load the pre-trained face detector
face_detector = dlib.get_frontal_face_detector()

# Load the pre-trained face recognition model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, '../data/dlib_face_recognition_resnet_model_v1.dat')
face_recognizer = dlib.face_recognition_model_v1(model_path)

cap = cv2.VideoCapture(0)
# Load the images of known individuals
# Base64-encoded JPEG images
known_images_base64 = [
    '''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''',
]

# Decode base64 and convert to dlib RGB images
known_images = []
for base64_image in known_images_base64:
    image_bytes = base64.b64decode(base64_image)
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    dlib_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    known_images.append(dlib_image)

# Compute the face embeddings for known individuals
known_embeddings = []
for image in known_images:
   embedding = face_recognizer.compute_face_descriptor(image)
   known_embeddings.append(embedding)
  
while True:
    # Read a frame from the webcam
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture a frame from the webcam.")
        break

    # Detect faces in the frame
    faces = face_detector(frame)

    for face in faces:
        # Compute the face embedding for the detected face
        test_embedding = face_recognizer.compute_face_descriptor(frame, face)

        # Compare the test embedding with known embeddings
        for i, known_embedding in enumerate(known_embeddings):
            distance = np.linalg.norm(np.array(test_embedding) - np.array(known_embedding))
            if distance < 0.6:
                print(f"Match found with person {i + 1}!")
            else:
                print(f"No match found with person {i + 1}!")

    # Display the frame with rectangles around detected faces
    for rect in faces:
        x, y, w, h = rect.left(), rect.top(), rect.width(), rect.height()
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Display the frame
    cv2.imshow("Face Recognition", frame)

    # Exit the loop when the 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
