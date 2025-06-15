from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from accounts.models import CustomUser
from django.middleware.csrf import get_token
from claims.models import Vehicle, Claim, Policyholder, Damage, Media


def user_detail_api(request, pk):
    if request.user.is_authenticated:
        if pk == 0:
            user = request.user
        else:
            user = get_object_or_404(CustomUser, pk=pk)
        serialized = user.serialize()
    else:
        serialized = { 'id': None }

    serialized['csrfToken'] = get_token(request)
    return JsonResponse({'user': serialized})


def policyholders_api(request):
    policyholders = Policyholder.objects.all()
    return JsonResponse({'policyholders': [policyholder.serialize() for policyholder in policyholders]})


def policyholder_api(request, pk):
    policyholder = get_object_or_404(Policyholder, id=pk)
    return JsonResponse({'policyholder': policyholder.serialize()})


def vehicles_api(request):
    vehicles = Vehicle.objects.all()
    return JsonResponse({'vehicles': [vehicle.serialize() for vehicle in vehicles]})


def vehicle_api(request, pk):
    vehicle = get_object_or_404(Vehicle, id=pk)
    return JsonResponse({'vehicle': vehicle.serialize()})


def claims_api(request):
    if request.method == 'POST':
        if 'create' in request.POST:
            policyholder_id = request.POST.get('policyholder')
            poliycholder = get_object_or_404(Policyholder, id=int(policyholder_id))
            vehicle_id = request.POST.get('vehicle')
            vehicle = get_object_or_404(Vehicle, id=int(vehicle_id))
            claim = Claim.objects.create(
                name=f'{vehicle.make} {vehicle.model} {vehicle.year}',
                policyholder=poliycholder,
                vehicle=vehicle,
            )
            for file in request.FILES.getlist('files'):
                claim.media.create(name=file.name, file=file, claim=claim)

    claims = Claim.objects.all()
    return JsonResponse({'claims': [claim.serialize() for claim in claims]})


def claim_api(request, pk):
    claim = get_object_or_404(Claim, id=pk)
    return JsonResponse({'claim': claim.serialize()})


def media_api(request, pk):
    claim = get_object_or_404(Claim, id=pk)
    return JsonResponse({'media': [media.serialize() for media in Media.objects.filter(claim=claim)]})


def damages_api(request, pk):
    claim = get_object_or_404(Claim, id=pk)
    return JsonResponse({'damages': [damage.serialize() for damage in Damage.objects.filter(media__claim=claim)]})
