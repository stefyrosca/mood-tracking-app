export interface Mood {
  id?: string;
  title: string;
  body: string;
  emotion: any; // ? img id
  recording?: any;
  userId: string;
  resourceType: string;
}
