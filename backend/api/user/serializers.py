from rest_framework import serializers
from .models import CustomUser, Profile, Message


class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        """ validate password and password confirmation fields match """
        password = data.get('password')
        confirm_password = data.pop('confirm_password', None)

        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists.")

        return data

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    def create(self, validated_data):
        confirm_password = validated_data.pop('confirm_password', None) # noqa

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username']
        read_only_fields = ['email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Profile
        fields = ['profile_id', 'full_name', 'date_of_birth', 'address',
                  'phone_number', 'currency_symbol', 'user', 'net_worth',
                  'cash_flow', 'total_spending']
        read_only_fields = ['profile_id']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        if user_data:
            user_serializer = CustomUserSerializer(instance.user,
                                                   data=user_data,
                                                   partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                raise serializers.ValidationError(user_serializer.errors)

        return super().update(instance, validated_data)


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'is_read', 'created_at']
