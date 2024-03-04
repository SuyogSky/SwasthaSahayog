from django.db import models
from django.conf import settings

class Post(models.Model):
    date = models.DateTimeField(auto_now=True)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images', null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return f"{self.user.username} {self.date}"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} Post {self.date}"
