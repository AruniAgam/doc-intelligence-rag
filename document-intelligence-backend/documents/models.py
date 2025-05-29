from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=10)
    size = models.IntegerField()
    pages = models.IntegerField(default=0)
    processing_status = models.CharField(max_length=50, default='pending')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    content = models.TextField()
    chunk_index = models.IntegerField()
    page_number = models.IntegerField(null=True, blank=True)
    embedding_id = models.CharField(max_length=128, null=True, blank=True)


class ChatSession(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
