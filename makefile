REMOTE_HOST=root@195.35.23.45
APP_NAME=lwa-frontend-mock

build-deploy:
	docker build --platform linux/amd64 -t ${APP_NAME} .
	docker save ${APP_NAME} > ${APP_NAME}.tar
	docker rmi ${APP_NAME}
	scp ./${APP_NAME}.tar ${REMOTE_HOST}:/root/
	rm ./${APP_NAME}.tar
	ssh -t ${REMOTE_HOST} 'sudo docker rm $$(sudo docker ps -aqf "name=${APP_NAME}") -f \
    &&  sudo docker rmi $$(sudo docker images -aqf "reference=${APP_NAME}") \
    &&  sudo docker load < /root/${APP_NAME}.tar \
    &&  rm /root/${APP_NAME}.tar \
    &&  sudo docker run -d -p 80:80 --name ${APP_NAME} ${APP_NAME}'
init-deploy:
	docker build --platform linux/amd64 -t ${APP_NAME} .
	docker save ${APP_NAME} > ${APP_NAME}.tar
	docker rmi ${APP_NAME}
	scp ./${APP_NAME}.tar ${REMOTE_HOST}:/root/
	rm ./${APP_NAME}.tar
	ssh -t ${REMOTE_HOST} 'sudo docker load < /root/${APP_NAME}.tar \
    &&  rm /root/${APP_NAME}.tar \
    &&  sudo docker run -d -p 80:80 --name ${APP_NAME} ${APP_NAME}'