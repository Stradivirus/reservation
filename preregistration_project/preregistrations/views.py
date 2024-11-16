from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse
from .models import Preregistration
from django.db.models import Count
from django.utils import timezone
from django.core.paginator import Paginator
import pytz

class PreregistrationListView(LoginRequiredMixin, ListView):
    model = Preregistration
    template_name = 'preregistrations/list.html'
    context_object_name = 'preregistrations'
    login_url = reverse_lazy('login')
    paginate_by = 30

    def get_total_registrations(self):
        return Preregistration.objects.count()

    def get_queryset(self):
        queryset = super().get_queryset().order_by('-created_at')
        filter_date = self.request.GET.get('date')
        filter_usage = self.request.GET.get('usage')
        
        kst = pytz.timezone('Asia/Seoul')

        if filter_date and filter_date != 'all':
            start_date = timezone.datetime.strptime(filter_date, "%Y-%m-%d").replace(tzinfo=kst)
            end_date = start_date + timezone.timedelta(days=1)
            queryset = queryset.filter(created_at__gte=start_date, created_at__lt=end_date)

        if filter_usage:
            if filter_usage == 'used':
                queryset = queryset.filter(is_coupon_used=True)
            elif filter_usage == 'unused':
                queryset = queryset.filter(is_coupon_used=False)

        return queryset

    def get_context_data(self, **kwargs):
        # 페이지 크기 설정
        page_size = self.request.GET.get('page_size', 30)
        self.paginate_by = int(page_size)
        
        context = super().get_context_data(**kwargs)
        kst = pytz.timezone('Asia/Seoul')
        
        now = timezone.now().astimezone(kst)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timezone.timedelta(days=1)

        today_registrations = Preregistration.objects.filter(
            created_at__gte=today_start,
            created_at__lt=today_end
        )
        
        date_counts = Preregistration.objects.extra(
            select={'date': "DATE(created_at AT TIME ZONE 'Asia/Seoul')"}
        ).values('date').annotate(count=Count('id')).order_by('-date')

        # 총 등록 인원수 추가
        total_registrations = self.get_total_registrations()

        context.update({
            'date_counts': date_counts,
            'current_date': self.request.GET.get('date', 'all'),
            'current_usage': self.request.GET.get('usage', 'all'),
            'today_registrations': today_registrations,
            'current_page_size': int(page_size),
            'total_registrations': total_registrations  # 새로 추가된 context
        })
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
            return render(request, 'preregistrations/login.html', {'error': '잘못된 사용자 정보입니다.'})
    return render(request, 'preregistrations/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')