from rest_framework import serializers
from .models import Comment
from blog.models import BlogPost

class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model.
    Used for both reading and creating comments.
    Includes additional fields like author_username for display purposes.
    """
    author_username = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    post_id = serializers.IntegerField(write_only=True)
    post = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 
            'post',
            'post_id',
            'author_id',
            'author_username', 
            'content', 
            'created_date', 
            'updated_date'
        ]
        read_only_fields = ['author_id', 'author_username', 'created_date', 'updated_date', 'post']

    def get_author_username(self, obj):
        """Get the username of the comment author"""
        return obj.author.username

    def validate_post_id(self, value):
        """
        Validate that the post exists
        """
        try:
            BlogPost.objects.get(id=value)
            return value
        except BlogPost.DoesNotExist:
            raise serializers.ValidationError("Blog post does not exist")

    def create(self, validated_data):
        """
        Override create method to set the author and post
        """
        post_id = validated_data.pop('post_id')
        post = BlogPost.objects.get(id=post_id)
        validated_data['post'] = post
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
