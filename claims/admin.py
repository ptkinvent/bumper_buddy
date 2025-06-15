from django.contrib import admin
from .models import Claim, Media, Damage, Vehicle, Policyholder

admin.site.register(Claim)
admin.site.register(Media)
admin.site.register(Damage)
admin.site.register(Vehicle)
admin.site.register(Policyholder)
