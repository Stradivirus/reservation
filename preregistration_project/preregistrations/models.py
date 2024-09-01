from django.db import models
from django.utils import timezone
import pytz

class Preregistration(models.Model):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=11, unique=True)  # 길이를 13으로 변경
    privacy_consent = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now().astimezone(pytz.timezone('Asia/Seoul'))
        super(Preregistration, self).save(*args, **kwargs)

    @property
    def created_at_kst(self):
        return self.created_at.astimezone(pytz.timezone('Asia/Seoul'))