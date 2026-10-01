export class SavedDate {
    constructor (
        id = "",
        userId = "",
        postId = "",
        title = "",
        date = "",
        savedAt = ""
    ) {
        this.id = data.id;
        this.userId = data.userId;
        this.postId = data.postId;
        this.title = data.title;
        this.date = data.date;
        this.savedAt = data.savedAt;
    }

    toFirebase() {
        return {
        id: this.id,
        userId: this.userId,
        postId: this.postId,
        title: this.title,
        date: this.date,
        savedAt: this.savedAt,
        };
    }
}