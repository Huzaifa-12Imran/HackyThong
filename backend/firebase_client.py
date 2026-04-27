import firebase_admin
from firebase_admin import credentials, firestore
import os

def initialize_firebase():
    if not firebase_admin._apps:
        firebase_admin.initialize_app(options={
            'projectId': os.getenv('FIREBASE_PROJECT_ID')
        })

def get_db():
    initialize_firebase()
    return firestore.client()
