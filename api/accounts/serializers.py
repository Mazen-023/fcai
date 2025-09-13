from rest_framework import serializers

from .models import User


# Create your serializers here.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]


class RegisterSerializers(serializers.ModelSerializer):
    confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "confirmation", "role"]
        extra_kwargs = {
            "confirmation": {"write_only": True},
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["confirmation"]:
            raise serializers.ValidationError("Password must match.")
        return data

    def create(self, validated_data):
        # Remove confirmation field from the data
        validated_data.pop("confirmation", None)

        # Add the valid user to the database
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"],
        )
        return user
