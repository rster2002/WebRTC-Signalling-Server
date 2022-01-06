export default class Client {
    connection;
    offer;
    answer;
    candidates = [];

    constructor(connection) {
        this.connection = connection;
    }

    getConnection() {
        return this.connection;
    }

    requestOffer() {
        this.send("requestOffer");
    }

    requestAnswer(offer) {
        this.send("requestAnswer", offer);
    }

    getOffer() {
        return this.offer;
    }

    getCandidates() {
        return this.candidates;
    }

    addIceCandidate(candidate) {
        this.candidates.push(candidate);
    }

    send(type, payload = {}) {
        this.connection.send(JSON.stringify({
            type,
            payload,
        }));
    }

    setOffer(offer) {
        this.offer = offer;
    }

    setAnswer(answer) {
        this.answer = answer;
    }
}