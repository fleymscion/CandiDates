export class DateModel {
    constructor (
        id = "",
        imageUrl = "",
        eventTitle = "",
        date = "",
        time = "",
        tags = [],
        description = "",
        classification = "regular" // THIS WILL BE CHANGABLE TO highlighed
    ) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.eventTitle = eventTitle;
        this.date = date;
        this.time = time;
        this.tags = tags;
        this.description = description;
        this.classification = classification;
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
        this.classification = classification;,
        };
    }
}
