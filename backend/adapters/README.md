# Celestia-Celebi Adapters
You can install an instance of the Celebi adapter from here, **please use the shell script given to install** otherwise if you are unable to use the shell script then please run `npm run libs` beforehand to copy the files from `/lib/` into the desired adapter.

There are a total of three adapters available for Celebi which are made to be compatiable with different architectures, these adapters will not reply back to the client but instead log into the console since all of these communication channels are one-way communications. Here are the list of adapters available:
- [x] Redis Pubsub
- [ ] RabbitMQ
- [ ] Kafka