from django.apps import AppConfig


class QuickpostServerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quickpost_server'

    def ready(self):
        import quickpost_server.signals