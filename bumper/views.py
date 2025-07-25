from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def index_view(request):
    return render(request, 'index.html')


@login_required
def dashboard_view(request):
    return render(request, 'index.html')


@login_required
def knowledge_base_view(request):
    return render(request, 'index.html')
