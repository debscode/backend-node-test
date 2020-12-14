import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })
    name: string;

    @IsNotEmpty()
    @Column({
        type: "varchar",
        nullable: false
    })
    category: string;
    
    @IsNotEmpty()
    @Column({
        type: "decimal",
        nullable: false
    })
    price: number;
       
    @IsNotEmpty()
    @Column({
        type: "int",
        nullable: false
    })
    stock: number;
}