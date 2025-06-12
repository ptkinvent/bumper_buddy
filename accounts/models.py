from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    AGENT = 'agent'
    ADJUSTER = 'adjuster'
    ROLE_CHOICES = [
        (AGENT, 'Agent'),
        (ADJUSTER, 'Adjuster'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=AGENT)

    def __str__(self):
        return self.email

    def serialize(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'role': self.role,
        }
