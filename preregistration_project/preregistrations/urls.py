from django.urls import path
from .views import PreregistrationListView

urlpatterns = [
    path('', PreregistrationListView.as_view(), name='preregistration_list'),
]