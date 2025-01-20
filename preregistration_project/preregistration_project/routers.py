class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        """
        auth 앱의 모델은 master DB에서 읽고
        나머지는 replica DB에서 읽습니다.
        """
        if model._meta.app_label in ['auth', 'sessions', 'admin']:
            return 'default'
        return 'replica'

    def db_for_write(self, model, **hints):
        """
        모든 쓰기 작업은 master DB로 라우팅합니다.
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        모든 데이터베이스 간의 관계를 허용합니다.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        마이그레이션은 master DB에서만 실행되도록 합니다.
        """
        if db == 'replica':
            return False
        return True