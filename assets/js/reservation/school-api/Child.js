export function Child(id, firstName, lastName, topicDays) {
    if (id) {
        this.id = id;
    }
    this.firstName = firstName;
    this.lastName = lastName;
    this.topicDays = topicDays;
}
