export default class Room {
    client1;
    client2;

    hasRoom() {
        return this.client2 === undefined;
    }

    setClient1(client) {
        this.client1 = client;

        this.client1.getConnection().on("message", (message) => {
            let { type, payload } = JSON.parse(message);

            console.log("Client 1", type, payload);

            if (type === "offerResponse") {
                this.client1.setOffer(payload);
            }

            if (type === "iceCandidate") {
                this.client1.addIceCandidate(payload);
            }
        });

        this.client1.requestOffer();
    }

    setClient2(client) {
        this.client2 = client;

        this.client2.getConnection().on("message", (message) => {
            let { type, payload } = JSON.parse(message);

            console.log("Client 2", type, payload);

            if (type === "answerResponse") {
                this.client2.setAnswer(payload);
                this.client1.send("answered", payload);
                this.client2.send("remoteIceCandidates", {
                    candidates: this.client1.getCandidates(),
                });
            }

            if (type === "iceCandidate") {
                this.client2.addIceCandidate(payload);

                this.client1.send("remoteIceCandidates", {
                    candidates: [payload],
                });
            }
        });

        this.client2.requestAnswer(this.client1.getOffer());
    }
}