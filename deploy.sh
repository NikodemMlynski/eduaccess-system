REMOTE_USER=pi
REMOTE_HOST=192.168.1.21
REMOTE_DIR=/home/pi/projects/eduaccess-system/hardware/pi5

rsync -avz ./hardware/pi5/ pi@192.168.1.21:~/projects/eduaccess-system/hardware/pi5
