from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ContactMessageViewSet, ContactCreateView

router = DefaultRouter()
router.register(r'contact-messages', ContactMessageViewSet, basename='contactmessage')

urlpatterns = [
    path('', include(router.urls)),
    path('contact', ContactCreateView.as_view(), name='contact-create'),
]
