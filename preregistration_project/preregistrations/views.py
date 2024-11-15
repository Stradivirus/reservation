from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse
from .models import Preregistration
from django.db.models import Count
from django.utils import timezone
import pytz

# 사전등록 목록 조회 뷰
class PreregistrationListView(LoginRequiredMixin, ListView):
    model = Preregistration
    template_name = 'preregistrations/list.html'
    context_object_name = 'preregistrations'
    ordering = ['-created_at']
    login_url = reverse_lazy('login')

    def get_queryset(self):
        queryset = super().get_queryset()
        filter_date = self.request.GET.get('date')
        filter_usage = self.request.GET.get('usage')
        
        kst = pytz.timezone('Asia/Seoul')

        # 날짜 필터링
        if filter_date and filter_date != 'all':
            start_date = timezone.datetime.strptime(filter_date, "%Y-%m-%d").replace(tzinfo=kst)
            end_date = start_date + timezone.timedelta(days=1)
            queryset = queryset.filter(created_at__gte=start_date, created_at__lt=end_date)

        # 쿠폰 사용 여부 필터링
        if filter_usage:
            if filter_usage == 'used':
                queryset = queryset.filter(is_coupon_used=True)
            elif filter_usage == 'unused':
                queryset = queryset.filter(is_coupon_used=False)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        kst = pytz.timezone('Asia/Seoul')
        
        # 현재 날짜 (KST 기준)
        now = timezone.now().astimezone(kst)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timezone.timedelta(days=1)

        # 오늘 등록한 인원 쿼리
        today_registrations = Preregistration.objects.filter(
            created_at__gte=today_start,
            created_at__lt=today_end
        )
        
        # 날짜별 사전등록 수 집계
        date_counts = Preregistration.objects.extra(
            select={'date': "DATE(created_at AT TIME ZONE 'Asia/Seoul')"}
        ).values('date').annotate(count=Count('id')).order_by('-date')

        context['date_counts'] = date_counts
        context['current_date'] = self.request.GET.get('date', 'all')
        context['current_usage'] = self.request.GET.get('usage', 'all')
        context['today_registrations'] = today_registrations
        return context

# 로그인 뷰
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

# 로그아웃 뷰
def logout_view(request):
    logout(request)
    return redirect('login')