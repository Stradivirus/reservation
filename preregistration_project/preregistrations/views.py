from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse
from .models import Preregistration
from django.db.models import Count
from django.utils import timezone
import pytz

class PreregistrationListView(LoginRequiredMixin, ListView):
    model = Preregistration
    template_name = 'preregistrations/list.html'
    context_object_name = 'preregistrations'
    ordering = ['-created_at']
    login_url = reverse_lazy('login')  # 로그인 URL을 동적으로 설정

    def get_queryset(self):
        queryset = super().get_queryset()
        filter_date = self.request.GET.get('filter')
        
        if filter_date and filter_date != 'all':
            kst = pytz.timezone('Asia/Seoul')
            start_date = timezone.datetime.strptime(filter_date, "%Y-%m-%d").replace(tzinfo=kst)
            end_date = start_date + timezone.timedelta(days=1)
            queryset = queryset.filter(created_at__gte=start_date, created_at__lt=end_date)

        # KST로 시간 변환
        kst = pytz.timezone('Asia/Seoul')
        for registration in queryset:
            registration.created_at = registration.created_at.astimezone(kst)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        date_counts = Preregistration.objects.extra(
            select={'date': "DATE(created_at AT TIME ZONE 'Asia/Seoul')"}
        ).values('date').annotate(count=Count('id')).order_by('-date')

        context['date_counts'] = date_counts
        return context

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(reverse('preregistration_list'))
        else:
            return render(request, 'preregistrations/login.html', {'error': 'Invalid credentials'})
    return render(request, 'preregistrations/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')