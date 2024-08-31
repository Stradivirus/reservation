import os
import subprocess

def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        print(f"Error executing command: {command}")
        print(f"Error message: {stderr.decode()}")
        return False
    return True

def install_nginx():
    print("Installing Nginx...")
    if not run_command("sudo apt update && sudo apt install -y nginx"):
        return False
    print("Nginx installed successfully")
    return True

def create_nginx_config():
    config = """
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /home/work/reservation/front/build;  # React 앱 빌드 파일 경로
    index index.html index.htm;
    server_name _;  # 모든 호스트 이름에 대해 매치

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱 설정 (선택사항)
    location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|css|js)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public";
    }
}
"""
    config_path = "/etc/nginx/sites-available/react-app"
    try:
        with open(config_path, 'w') as f:
            f.write(config)
        print(f"Nginx configuration created at {config_path}")
        return True
    except Exception as e:
        print(f"Error creating Nginx configuration: {e}")
        return False

def setup_nginx_symlink():
    if not run_command("sudo ln -sf /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/"):
        return False
    print("Nginx symlink created")
    return True

def remove_default_nginx_config():
    if os.path.exists("/etc/nginx/sites-enabled/default"):
        if not run_command("sudo rm /etc/nginx/sites-enabled/default"):
            return False
        print("Default Nginx configuration removed")
    return True

def restart_nginx():
    if not run_command("sudo nginx -t && sudo systemctl restart nginx"):
        return False
    print("Nginx restarted successfully")
    return True

def main():
    if os.geteuid() != 0:
        print("This script must be run as root (use sudo)")
        return

    if (install_nginx() and 
        create_nginx_config() and 
        setup_nginx_symlink() and 
        remove_default_nginx_config() and 
        restart_nginx()):
        print("Nginx setup completed successfully")
    else:
        print("Failed to set up Nginx")

if __name__ == "__main__":
    main()
