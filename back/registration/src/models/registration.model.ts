import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ 
  tableName: 'preregistrations_preregistration',
  timestamps: true,
  createdAt: false,
  updatedAt: false 
})
export class Registration extends Model {
  @Column({
    type: DataType.STRING,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING(11),
    unique: true
  })
  phone: string;

  @Column(DataType.BOOLEAN)
  privacy_consent: boolean;

  @Column(DataType.DATE)
  created_at: Date;

  @Column({
    type: DataType.STRING,
    unique: true
  })
  coupon_code: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  is_coupon_used: boolean;
}