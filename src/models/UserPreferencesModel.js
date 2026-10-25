export const CALENDAR_VIEW_MODES = { GRID: 'grid', LIST: 'list' };

export const DEFAULT_NOTIFICATION_PREFS = { sound: true, mute: false, vibrate: true };

export const JOB_CATEGORY_OPTIONS = [
  'Information Technology',
  'Engineering',
  'Healthcare',
  'Education',
  'Finance & Accounting',
  'Marketing & Sales',
  'Customer Service',
  'Design & Creative',
  'Hospitality & Tourism',
  'Administration',
  'Skilled Trades',
  'Remote / Freelance',
];

export class UserPreferences {
  constructor(data = {}) {
    this.notificationPrefs = {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...(data.notificationPrefs || {}),
    };
    this.calendarViewMode = Object.values(CALENDAR_VIEW_MODES).includes(data.calendarViewMode)
      ? data.calendarViewMode
      : CALENDAR_VIEW_MODES.GRID;
    this.jobCategories = Array.isArray(data.jobCategories) ? data.jobCategories : [];
  }

  toFirebase() {
    return {
      notificationPrefs: this.notificationPrefs,
      calendarViewMode: this.calendarViewMode,
      jobCategories: this.jobCategories,
    };
  }
}

// A resume or portfolio file uploaded by an employee
export class UserFile {
  constructor(data = {}) {
    this.id = data.id ?? '';
    this.name = data.name ?? '';
    this.kind = data.kind ?? 'resume'; // 'resume' | 'portfolio'
    this.url = data.url ?? '';
    this.storagePath = data.storagePath ?? '';
    this.size = data.size ?? 0;
    this.mimeType = data.mimeType ?? '';
    this.uploadedAt = data.uploadedAt ?? '';
  }

  toFirebase() {
    return {
      id: this.id,
      name: this.name,
      kind: this.kind,
      url: this.url,
      storagePath: this.storagePath,
      size: this.size,
      mimeType: this.mimeType,
      uploadedAt: this.uploadedAt,
    };
  }
}
