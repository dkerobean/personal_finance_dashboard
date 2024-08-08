from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from .models import (CustomUser, Profile, Expense, Income,
                     NetWorth, Budget, Message)


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


# update financials(cashflow, total expenses)
@receiver(post_save, sender=Income)
@receiver(post_save, sender=Expense)
@receiver(post_delete, sender=Income)
@receiver(post_delete, sender=Expense)
def update_profile_financials(sender, instance, **kwargs):
    profile = instance.user.profile
    profile.update_financials()


@receiver(post_save, sender=Income)
@receiver(post_delete, sender=Income)
@receiver(post_save, sender=Expense)
@receiver(post_delete, sender=Expense)
def update_profile_net_worth(sender, instance, **kwargs):
    user = instance.user

    # Calculate the net worth using the class method
    net_worth_record = NetWorth.calculate_net_worth(user)

    # Update or create the profile
    profile, created = Profile.objects.get_or_create(user=user)
    profile.net_worth = net_worth_record.net_worth
    profile.save()


@receiver(post_save, sender=Expense)
@receiver(post_delete, sender=Expense)
def update_budget_on_expense_change(sender, instance, **kwargs):
    budgets = Budget.objects.filter(user=instance.user)
    for budget in budgets:
        if budget.start_date <= instance.date <= budget.end_date:
            total_spent = Expense.objects.filter(
                user=instance.user,
                # category=instance.category,
                date__range=[budget.start_date, budget.end_date]
            ).aggregate(total=Sum('amount'))['total'] or 0
            budget.spent_amount = total_spent
            budget.save()


# delete notifications if budget is deleted
@receiver(post_delete, sender=Budget)
def delete_related_messages(sender, instance, **kwargs):
    # Delete all messages related to the deleted budget
    Message.objects.filter(user=instance.user, content__contains=instance.name).delete()  # noqa
