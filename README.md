![image](https://user-images.githubusercontent.com/69381903/163691703-020f241f-50d8-474b-94e2-b368ba64504f.png)
# 🌇 Celestia
Celestia is the formal successor to Celebi's front-end client and REST API which aims to make logging more beautiful than before. Unlike Celebi, Celestia uses a single access token located in your `.env` file for authentication which thereby saves time and effort of creating accounts.

Also unlike Celebi, Celestia is powered by Sveltekit all the way which allows reactivity, creating a more dynamic look of the pages.

## 📦 Installation
If you do not already have a Celebi MongoDB Docker running then you can upstart one by running the `docker-compose up -d` which generates a MongoDB Docker but this doesn't include the Celebi Docker itself. To install Celestia, all you need to do is run the following command:
```shell
docker build -t celestia .
```

Afterwards, you can create a new container from the image via:
```shell
docker run -d -i -t --env-file .env -p 3000:3000 --restart=always --name celestia celestia
```

## 📓 Configuration
There are three required configuration for Celestia and those include:
- `MONGO_URI`: The connection URI to the MongoDB instance.
- `ACCESS_TOKEN`: The public-facing access-token required by users to view the logs.
- `APP_SIGNATURE`: A special private signature used to sign the cookies.
