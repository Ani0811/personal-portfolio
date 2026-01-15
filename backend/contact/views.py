from rest_framework import viewsets, permissions, generics
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        # Allow anyone to create a message, but restrict list/retrieve/update/delete to admins
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ContactCreateView(generics.CreateAPIView):
    """POST-only endpoint to create contact messages (open to anyone)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
