import { makeIri } from './iri-maker.js';

export function TopicDay(id, childId, topic, dayDate) {
    if (id) {
        this.id = id;
    }
    this.child = makeIri('children', childId);
    this.topic = topic;
    this.day = dayDate;
}
