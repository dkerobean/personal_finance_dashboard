from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import CustomUser, Profile


@receiver(post_save, sender=CustomUser)
def create_or_update_user(sender, created, instance, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()


@receiver(post_delete, sender=CustomUser)
def delete_user(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.delete()