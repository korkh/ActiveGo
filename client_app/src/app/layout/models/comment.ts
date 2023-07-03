export interface ChatComment {
  id: number;
  createdAt: any; //used any avoid getting typescript error for Date
  body: string;
  userName: string;
  displayName: string;
  image: string;
}
