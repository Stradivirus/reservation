from django.db import models

class Preregistration(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    privacy_consent = models.BooleanField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'preregistrations'

    def __str__(self):
        return self.email