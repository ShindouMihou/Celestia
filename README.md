![Celestia Banner](https://user-images.githubusercontent.com/69381903/163735091-62a62124-ba88-48df-8627-e98b65de068a.png)
Celestia is the formal successor to Celebi's front-end client (one of our internal little logging thing) and REST API which aims to make logging more beautiful than before. Unlike Celebi, Celestia uses a single access token located in your `.env` file for authentication which thereby saves time and effort of creating accounts.

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

## 🧭 Routes
There are only a few routes that exists in Celestia:
- `/gateway`: The authentication page (required before accessing protected routes).
- `/dashboard/`: The general dashboard page which one can see all the documents and glassboxes.
- `/dashboard/{glassbox}/`: The same as above except that it directs to a specific glassbox.
- `/dashboard/{glassbox}/{document}/`: The document page where you can view the details of the documents.

## 📓 Configuration
There are four required configuration for Celestia and those include:
- `MONGO_URI`: The connection URI to the MongoDB instance.
- `ACCESS_TOKEN`: The public-facing access-token required by users to view the logs.
- `APP_SIGNATURE`: A special private signature used to sign the cookies.
- `MONGO_DATABASE`: The database name to create all the data on the MongoDB instance.

## 🔮 Celebi-Celestia Adapters
There are a total of three adapters available for Celebi which are made to be compatiable with different architectures, these adapters will not reply back to the client but instead log into the console since all of these communication channels are one-way communications. Here are the list of adapters available:
- [x] Redis Pubsub
- [ ] RabbitMQ
- [ ] Kafka

You can install an instance of the Celebi adapter from [adapters](https://github.com/ShindouMihou/Celestia/tree/master/backend/adapters).

## 💻 Drivers
There are currently no drivers available for Celebi-Celestia, although the requirement for one isn't that much needed as all that is needed is attaching some form of communication channel such as Redis Pubsub and sending all the messages from there in the form of JSON. If you want to create your own then here are some general rules.
1. All documents must contain a `_event` field which is displayed as the second heading on the document.
2. All documents must contain a `_glassbox` field which is used to determine the collection to store the document.
3. All messages must include a `_callback` field (which is currently not used at this moment but might be used in the future).

> Messages can include a `_message` field which tells Celestia to include a large box for that specific field. `_message` is reserved for enormous blobs of texts.

You can add different kinds of fields directly to display them onto the client. To explain this in a more programmer's way, let's show a sample JSON document that is accepted in Celebi-Celestia.
```json
{
  "_event": "ADD",
  "_glassbox": "Likes",
  "_callback": "ignored",
  "_message": "An image was liked.",
  "user": 5841242423241,
  "image": "mycutekitty.png"
}
```

## 🧑‍🎨 Previews
<details>
  <summary>Glassbox Viewer</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/166095639-c1c335e8-3300-4750-bc4e-964012e0840b.png)
</details>

<details>
  <summary>Document Viewer</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/166095643-ed123071-2633-4baa-8eeb-b2c4fc316384.png)
</details>

# 📚 License
Celestia follows Apache 2.0 license which allows the following permissions:
- ✔ Commercial Use
- ✔ Modification
- ✔ Distribution
- ✔ Patent use
- ✔ Private use

The contributors and maintainers of Celestia are not to be held liability over any creations that uses Nexus. We also forbid trademark use of
the library and there is no warranty as stated by Apache 2.0 license. You can read more about the Apache 2.0 license on [GitHub](https://github.com/ShindouMihou/Celestia/blob/master/LICENSE).
