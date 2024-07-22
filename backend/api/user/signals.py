from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import (CustomUser, Profile, Expense, Income, NetWorth)


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


@receiver(post_save, sender=Income)
@receiver(post_save, sender=Expense)
def update_profile_net_worth(sender, instance, **kwargs):
    user = instance.user

    # Calculate the net worth using the class method
    net_worth_record = NetWorth.calculate_net_worth(user)

    # Update or create the profile
    profile, created = Profile.objects.get_or_create(user=user)
    profile.net_worth = net_worth_record.net_worth
    profile.save()