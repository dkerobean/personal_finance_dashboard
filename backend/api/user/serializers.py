from rest_framework import serializers
from .models import CustomUser

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
        confirm_password = validated_data.pop('confirm_password', None)

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user