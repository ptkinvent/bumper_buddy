from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

from .models import Claim


@login_required
def index(request):
    return render(request, 'index.html')


@login_required
def detail(request, pk):
    claim = get_object_or_404(Claim, id=pk)
    return render(request, 'index.html')
