import os
import dlib

def compute_face_embeddings(images):
    face_detector = dlib.get_frontal_face_detector()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, '../data/dlib_face_recognition_resnet_model_v1.dat')
    face_recognizer = dlib.face_recognition_model_v1(model_path)
    
    embeddings = []
    
    for image in images:
        faces = face_detector(image)

        if faces:
            embedding = face_recognizer.compute_face_descriptor(image)
            embeddings.append(embedding)
    
    return embeddings