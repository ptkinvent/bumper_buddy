import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from accounts.models import CustomUser
from django.middleware.csrf import get_token

from claims.models import Vehicle, Claim, Media, Damage, Part
from .auto_assess_agent import AutoAssessAgent
from .assistant_agent import AssistantAgent


def users_api(request):
    users = CustomUser.objects.all()
    return JsonResponse({'users': [user.serialize() for user in users]})


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


def vehicles_api(request):
    vehicles = Vehicle.objects.all()
    return JsonResponse({'vehicles': [vehicle.serialize() for vehicle in vehicles]})


def vehicle_api(request, pk):
    vehicle = get_object_or_404(Vehicle, id=pk)
    return JsonResponse({'vehicle': vehicle.serialize()})


def parts_api(request):
    parts = Part.objects.all()
    return JsonResponse({'parts': [part.serialize() for part in parts]})


def claims_api(request):
    if request.method == 'POST':
        if 'create' in request.POST:
            vehicle_id = request.POST['vehicle']
            region = request.POST['region']
            vehicle = get_object_or_404(Vehicle, id=int(vehicle_id))
            claim = Claim.objects.create(
                name=f'{vehicle.make} {vehicle.model} {vehicle.year}',
                vehicle=vehicle,
                region=region,
            )
            for file in request.FILES.getlist('files'):
                claim.media.create(name=file.name, file=file, claim=claim)
            return JsonResponse({'claim': claim.serialize()})

        elif 'update_assignee' in request.POST:
            claim_id = request.POST['claim']
            category = request.POST['category']
            assignee_id = request.POST['assignee']
            claim = get_object_or_404(Claim, id=int(claim_id))
            if category == 'author':
                claim.author = get_object_or_404(CustomUser, id=int(assignee_id))
            else:
                claim.reviewer = get_object_or_404(CustomUser, id=int(assignee_id))
            claim.save()

        elif 'remove_assignee' in request.POST:
            claim_id = request.POST['claim']
            category = request.POST['category']
            claim = get_object_or_404(Claim, id=int(claim_id))
            if category == 'author':
                claim.author = None
            else:
                claim.reviewer = None
            claim.save()

        elif 'delete' in request.POST:
            claim_id = request.POST['claim']
            claim = get_object_or_404(Claim, id=int(claim_id))
            claim.delete()

    claims = Claim.objects.all()
    return JsonResponse({'claims': [claim.serialize() for claim in claims]})


def claim_api(request, pk):
    claim = get_object_or_404(Claim, id=pk)

    if request.method == 'POST':
        if 'update_stage' in request.POST:
            stage = request.POST['update_stage']
            if stage == 'request_review':
                claim.is_in_review = True
            elif stage == 'return_to_author':
                claim.is_in_review = False
            elif stage == 'approve':
                claim.is_approved = True
                # Update parts library with new costs
                for damage in claim.damages.all():
                    if damage.repair_type == Damage.REPLACE and Part.objects.filter(vehicle=claim.vehicle).filter(name=damage.name).exists():
                        part = Part.objects.get(vehicle=claim.vehicle, name=damage.name)
                        part.cost = damage.parts_cost + damage.labor_cost
                        part.damages.add(damage)
                        part.save()
                    else:
                        part = Part.objects.create(
                            name=damage.name,
                            cost=damage.parts_cost + damage.labor_cost,
                            vehicle=claim.vehicle
                        )
                        part.damages.add(damage)
                        part.save()
            elif stage == 'unapprove':
                claim.is_approved = False
            claim.save()

    return JsonResponse({'claim': claim.serialize()})


def media_api(request, pk):
    claim = get_object_or_404(Claim, id=pk)
    return JsonResponse({'media': [media.serialize() for media in Media.objects.filter(claim=claim)]})


def damages_api(request):
    if request.method == 'POST':
        if 'create' in request.POST:
            claim_id = request.POST['claim_id']
            claim = get_object_or_404(Claim, id=int(claim_id))
            Damage.objects.create(
                claim=claim,
                repair_type=Damage.REPLACE,
                parts_cost=0,
                parts_cost_source=Damage.SOURCE_USER,
                labor_cost=0,
                labor_cost_source=Damage.SOURCE_USER,
            )

        elif 'import' in request.POST:
            claim_id = request.POST['claim_id']
            claim = get_object_or_404(Claim, id=int(claim_id))
            damages = json.loads(request.POST['damages'])
            for damage in damages:
                Damage.objects.create(
                    name=damage['name'],
                    repair_type=damage['repairType'],
                    parts_cost=damage['partsCost'],
                    parts_cost_source=damage['partsCostSource'],
                    labor_cost=damage['laborCost'],
                    labor_cost_source=damage['laborCostSource'],
                    claim=claim,
                )

        elif 'update' in request.POST:
            damage_id = request.POST['update']
            damage = get_object_or_404(Damage, id=int(damage_id))
            damage.name = request.POST['name']
            damage.repair_type = request.POST['repairType']
            parts_cost = float(request.POST['partsCost'])
            if parts_cost != damage.parts_cost:
                damage.parts_cost = parts_cost
                damage.parts_cost_source = Damage.SOURCE_USER
            labor_cost = float(request.POST['laborCost'])
            if labor_cost != damage.labor_cost:
                damage.labor_cost = labor_cost
                damage.labor_cost_source = Damage.SOURCE_USER
            damage.save()

        elif 'delete' in request.POST:
            damage_id = request.POST['damage_id']
            damage = get_object_or_404(Damage, id=int(damage_id))
            damage.delete()

    claim_id = request.GET.get('claim')
    damages = Damage.objects.all()
    if claim_id:
        claim = get_object_or_404(Claim, id=int(claim_id))
        damages = damages.filter(claim=claim)

    return JsonResponse({'damages': [damage.serialize() for damage in damages]})


def auto_assess_api(request):
    if request.method == 'POST':
        if 'auto_assess' in request.POST:
            claim_id = request.POST['claim']
            claim = get_object_or_404(Claim, id=int(claim_id))
            agent = AutoAssessAgent()
            assessment = agent.run(claim.vehicle, claim.media.all())
            return JsonResponse({'assessment': assessment})


def assistant_api(request):
    if request.method == 'POST':
        if 'assistant' in request.POST:
            chat = request.POST['chat']
            chat_history = json.loads(request.POST['history'])
            agent = AssistantAgent()
            response = agent.run(chat, chat_history)
            return JsonResponse({'response': response})
