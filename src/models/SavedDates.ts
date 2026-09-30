export type SavedDateData = {
  id: string;
  userId: string;
  postId: string;
  title: string;
  date: string;
  savedAt: string;
};

export class SavedDate {
  id: string;
  userId: string;
  postId: string;
  title: string;
  date: string;
  savedAt: string;

  constructor(data: SavedDateData) {
    this.id = data.id;
    this.userId = data.userId;
    this.postId = data.postId;
    this.title = data.title;
    this.date = data.date;
    this.savedAt = data.savedAt;
  }

   toJSON(): SavedDateData {
    return {
      id: this.id,
      userId: this.userId,
      postId: this.postId,
      title: this.title,
      date: this.date,
      savedAt: this.savedAt,
    };
  }

   static fromJSON(data: SavedDateData): SavedDate {
    return new SavedDate(data);
  }
}