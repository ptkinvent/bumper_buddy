from django.db import models
from accounts.models import CustomUser


class Policyholder(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def serialize(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
        }


class Vehicle(models.Model):
    make = models.CharField(max_length=64)
    model = models.CharField(max_length=64)
    year = models.CharField(max_length=64)
    img = models.ImageField(upload_to='vehicles/', max_length=1023, blank=True)

    def __str__(self):
        return f'{self.make} {self.model} {self.year}'

    def serialize(self):
        return {
            'id': self.id,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'imgUrl': self.img.url if self.img else None,
        }


class Claim(models.Model):
    UNASSIGNED = 'unassigned'
    ASSIGNED = 'assigned'
    IN_REVIEW = 'in_review'
    APPROVED = 'approved'

    STAGE_CHOICES = [
        (UNASSIGNED, 'Unassigned'),
        (ASSIGNED, 'Assigned'),
        (IN_REVIEW, 'In Review'),
        (APPROVED, 'Approved'),
    ]

    name = models.CharField(max_length=255)
    policyholder = models.ForeignKey(Policyholder, on_delete=models.CASCADE, related_name='policyholder')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='vehicle')
    notes = models.TextField(blank=True)
    stage = models.CharField(max_length=32, choices=STAGE_CHOICES, default=UNASSIGNED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='author', null=True, blank=True)
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviewer', null=True, blank=True)

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'policyholderId': self.policyholder.id,
            'vehicleId': self.vehicle.id,
            'notes': self.notes,
            'stage': self.stage,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }


class Media(models.Model):
    name = models.CharField(max_length=1023)
    file = models.ImageField(upload_to='claims/', max_length=1023)
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='media')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'fileUrl': self.file.url,
            'claimId': self.claim.id,
            'uploadedAt': self.uploaded_at,
        }


class Damage(models.Model):
    location = models.CharField(max_length=255)
    severity = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    media = models.ForeignKey(Media, on_delete=models.CASCADE, related_name='damages')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f'{self.claim_media.name} - {self.location} - {self.severity}'

    def serialize(self):
        return {
            'id': self.id,
            'mediaId': self.media_id,
            'claimId': self.media.claim.id,
            'location': self.location,
            'severity': self.severity,
            'cost': self.cost,
            'notes': self.notes,
        }
