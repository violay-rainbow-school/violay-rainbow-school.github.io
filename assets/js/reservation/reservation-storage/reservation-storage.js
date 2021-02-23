const SESSION_KEY_INITIAL_TOPIC_DAYS = 'initialTopicDays';

export function saveTopicDaysToSession(topicDays) {
    sessionStorage.setItem(SESSION_KEY_INITIAL_TOPIC_DAYS, JSON.stringify(topicDays));
}

export function getInitialTopicDaysFromSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY_INITIAL_TOPIC_DAYS));
}
