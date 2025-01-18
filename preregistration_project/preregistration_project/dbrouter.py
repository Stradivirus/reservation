class ReadReplicaRouter:
    def db_for_read(self, model, **hints):
        """
        Sends reads to replica DB except for auth and admin models
        """
        # auth, admin, sessions 관련 모델은 default DB 사용
        if model._meta.app_label in ('auth', 'admin', 'sessions', 'contenttypes'):
            return 'default'
        return 'replica'

    def db_for_write(self, model, **hints):
        """
        Writes always go to default DB.
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All migrations go to the default database only.
        """
        return db == 'default'