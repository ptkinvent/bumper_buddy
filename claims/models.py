from django.db import models
from accounts.models import CustomUser


class Vehicle(models.Model):
    make = models.CharField(max_length=64)
    model = models.CharField(max_length=64)
    year = models.CharField(max_length=64)
    img = models.ImageField(upload_to='vehicles/', max_length=1023, blank=True)

    class Meta:
        ordering = ['make', 'model', 'year']

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


class Part(models.Model):
    name = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='parts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'cost': self.cost,
            'vehicleId': self.vehicle.id,
            'damageIds': [damage.id for damage in self.damages.all()],
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }


class Claim(models.Model):
    name = models.CharField(max_length=255)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='vehicle')
    region = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='authored_claims', null=True, blank=True)
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviewed_claims', null=True, blank=True)
    is_in_review = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def stage(self):
        if self.is_approved:
            return 'approved'
        elif self.is_in_review:
            return 'in_review'
        else:
            if self.author is not None:
                return 'assigned'
            else:
                return 'unassigned'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'vehicleId': self.vehicle.id,
            'notes': self.notes,
            'stage': self.stage,
            'authorId': self.author.id if self.author else None,
            'reviewerId': self.reviewer.id if self.reviewer else None,
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
    REPAIR = 'repair'
    REPLACE = 'replace'
    REFINISH = 'refinish'
    REPAIR_TYPE_CHOICES = [
        (REPLACE, 'Replace'),
        (REPAIR, 'Repair'),
        (REFINISH, 'Refinish'),
    ]

    SOURCE_USER = 'user'
    SOURCE_LLM = 'llm'
    SOURCE_LIBRARY = 'library'
    COST_SOURCE_CHOICES = [
        (SOURCE_USER, 'User'),
        (SOURCE_LLM, 'LLM'),
        (SOURCE_LIBRARY, 'Library'),
    ]

    name = models.CharField(max_length=255, blank=True)
    repair_type = models.CharField(max_length=255, choices=REPAIR_TYPE_CHOICES, blank=True)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    parts_cost_source = models.CharField(max_length=255, choices=COST_SOURCE_CHOICES, blank=True, null=True)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    labor_cost_source = models.CharField(max_length=255, choices=COST_SOURCE_CHOICES, blank=True, null=True)
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name='damages')
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='damages', null=True, blank=True)

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'claimId': self.claim.id,
            'repairType': self.repair_type,
            'partsCost': self.parts_cost,
            'partsCostSource': self.parts_cost_source,
            'laborCost': self.labor_cost,
            'laborCostSource': self.labor_cost_source,
            'partId': self.part.id if self.part else None,
        }
