from django.db import models
from django.conf import settings

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    summary = models.TextField(blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title