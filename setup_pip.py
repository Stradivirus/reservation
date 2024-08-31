import subprocess
import sys

def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        print(f"Error executing command: {command}")
        print(f"Error message: {stderr.decode()}")
        return False
    return True

def install_pip():
    print("Installing pip...")
    commands = [
        "sudo apt update",
        "sudo apt install -y python3-pip"
    ]
    for command in commands:
        if not run_command(command):
            return False
    
    # pip 버전 확인
    if not run_command("pip3 --version"):
        return False

    print("pip installed successfully")
    return True

def main():
    if sys.platform != "linux":
        print("This script is intended for Linux systems only.")
        return

    if install_pip():
        print("pip installation completed successfully")
    else:
        print("Failed to install pip")

if __name__ == "__main__":
    main()
