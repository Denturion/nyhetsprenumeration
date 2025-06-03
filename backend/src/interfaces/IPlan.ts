import { RowDataPacket } from "mysql2";

export interface IPlan extends RowDataPacket {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}