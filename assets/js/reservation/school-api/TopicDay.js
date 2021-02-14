export function TopicDay(id, childIri, topic, dayDate) {
    if (id) {
        this.id = id;
    }
    this.child = childIri;
    this.topic = topic;
    this.day = dayDate;
}
