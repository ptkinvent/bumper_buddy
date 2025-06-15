from django.contrib import admin
from .models import Vehicle, Part, Claim, Media, Damage

admin.site.register(Vehicle)
admin.site.register(Part)
admin.site.register(Claim)
admin.site.register(Media)
admin.site.register(Damage)
