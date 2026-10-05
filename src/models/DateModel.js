export class Date {
    constructor (
        id = "",
        imageUrl = "",
        eventTitle = "",
        date = "",
        time = "",
        tags = [],
        description = ""
    ) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.eventTitle = eventTitle;
        this.date = date;
        this.time = time;
        this.tags = tags;
        this.description = description;
    }

    toFirebase() {
        return {
        id: this.id,
        imageUrl: this.imageUrl,
        eventTitle: this.eventTitle,
        date: this.date,
        time: this.time,
        tags: this.tags,
        description: this.description,
        };
    }
}
