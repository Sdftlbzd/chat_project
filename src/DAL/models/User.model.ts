import { Column, Entity } from "typeorm";
import { CommonEntity } from "./Common.model";
import { ERoleType } from "../../Core/app/enum";

@Entity({ name: "users" })
export class User extends CommonEntity {
  @Column({ type: "varchar", length: 150, default: null })
  name: string;

  @Column({ type: "varchar", length: 150, default: null })
  surname: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ type: "varchar", length: 150 })
  password: string;

  @Column({ type: "varchar", default: null })
  username: String;

  @Column({
    type: "enum",
    enum: ERoleType,
    default: ERoleType.USER,
  })
  role: ERoleType;

  //   @Column({
  //     type: "enum",
  //     enum: EStatusType,
  //     default: EStatusType.ACTIVE,
  //   })
  //   status: EStatusType;
}
