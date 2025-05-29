from django.urls import path
from . import views

urlpatterns = [
     # Optional root response
    path('documents/', views.list_documents),
    path('upload/', views.upload_document),
    path('documents/<int:doc_id>/', views.delete_document),
    path('ask-question/', views.ask_question),
    path('chat-history/<int:session_id>/', views.get_chat_history),
    
]
