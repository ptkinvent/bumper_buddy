from django import forms
from allauth.account.forms import SignupForm
from accounts.models import CustomUser


class CustomSignupForm(SignupForm):
    first_name = forms.CharField(max_length=30, label='First Name')
    last_name = forms.CharField(max_length=30, label='Last Name')

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'password1']
