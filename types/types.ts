export interface Ride {
  id: string;
  userId: string;
  from: string;
  to: string;
  date: { seconds: number; nanoseconds: number };
  price: number;
}
