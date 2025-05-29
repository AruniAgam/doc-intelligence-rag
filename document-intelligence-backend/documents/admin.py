from django.contrib import admin
from .models import Document, DocumentChunk, ChatSession, ChatMessage

admin.site.register(Document)
admin.site.register(DocumentChunk)
admin.site.register(ChatSession)
admin.site.register(ChatMessage)
