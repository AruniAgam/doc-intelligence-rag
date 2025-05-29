from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, this is the homepage!")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('documents.urls')),  # Include app URLs
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

