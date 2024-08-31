import os
import subprocess
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        print(f"Error executing command: {command}")
        print(f"Error message: {stderr.decode()}")
        return False
    return True

def create_db_and_user():
    # PostgreSQL 설치
    if not run_command("sudo apt update && sudo apt install -y postgresql postgresql-contrib"):
        return False

    # 데이터베이스 및 사용자 생성
    try:
        # 루트 연결
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        # 데이터베이스 생성
        cur.execute("CREATE DATABASE preregistration_db")
        
        # 사용자 생성 및 권한 부여
        cur.execute("CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword'")
        cur.execute("GRANT ALL PRIVILEGES ON DATABASE preregistration_db TO myuser")

        # preregistration_db에 연결
        cur.close()
        conn.close()
        conn = psycopg2.connect(
            dbname='preregistration_db',
            user='postgres',
            password='',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        # 스키마 권한 부여
        cur.execute("GRANT ALL ON SCHEMA public TO myuser")
        cur.execute("GRANT ALL ON ALL TABLES IN SCHEMA public TO myuser")
        cur.execute("GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO myuser")
        cur.execute("GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO myuser")
        cur.execute("ALTER SCHEMA public OWNER TO myuser")

        print("Database and user created successfully")
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return True

def create_env_file():
    env_content = """
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=preregistration_db
    """
    with open('.env', 'w') as f:
        f.write(env_content.strip())
    print(".env file created")

def main():
    if os.geteuid() != 0:
        print("This script must be run as root (use sudo)")
        return

    if create_db_and_user():
        create_env_file()
        print("PostgreSQL setup completed successfully")
    else:
        print("Failed to set up PostgreSQL")

if __name__ == "__main__":
    main()