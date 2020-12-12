import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { IsNotEmpty, IsEmail } from "class-validator";
import bcrypt from 'bcrypt';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @IsNotEmpty()
    @Column({
        type: "varchar",
        nullable: false
    })
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })
    email: string;

    @IsNotEmpty()
    @Column({
        type: "varchar",
        nullable: false,
    })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
    }

    toJSON() {
        delete this.password;
        return this;
    }
}