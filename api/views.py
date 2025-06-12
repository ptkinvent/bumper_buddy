from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from accounts.models import CustomUser
from django.middleware.csrf import get_token


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
