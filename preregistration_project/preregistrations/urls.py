from django.urls import path
from . import views

urlpatterns = [
    path('preregistration_list/', views.PreregistrationListView.as_view(), name='preregistration_list'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]