from django.views.generic import ListView
from .models import Preregistration
from django.db.models import Count, F, Value, ExpressionWrapper, DateField, DateTimeField
from django.db.models.functions import Cast
from django.utils import timezone
from django.db.models.expressions import RawSQL
import pytz

class PreregistrationListView(ListView):
    model = Preregistration
    template_name = 'preregistrations/list.html'
    context_object_name = 'preregistrations'
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        filter_date = self.request.GET.get('filter')
        kst = pytz.timezone('Asia/Seoul')

        if filter_date and filter_date != 'all':
            # KST 날짜로 필터링
            start_date = timezone.datetime.strptime(filter_date, "%Y-%m-%d").replace(tzinfo=kst)
            end_date = start_date + timezone.timedelta(days=1)
            queryset = queryset.filter(created_at__gte=start_date.astimezone(pytz.UTC),
                                       created_at__lt=end_date.astimezone(pytz.UTC))

        # KST로 시간 변환 (데이터베이스 레벨에서 수행)
        queryset = queryset.annotate(
            created_at_kst=ExpressionWrapper(
                RawSQL("created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul'", []),
                output_field=DateTimeField()
            )
        ).order_by('-created_at_kst')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # KST 기준으로 날짜별 등록 수 계산
        kst_date = ExpressionWrapper(
            RawSQL("DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')", []),
            output_field=DateField()
        )
        
        date_counts = Preregistration.objects.annotate(
            date=kst_date
        ).values('date').annotate(count=Count('id')).order_by('-date')

        context['date_counts'] = date_counts
        return context