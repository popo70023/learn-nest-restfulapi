import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'username must be added' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'password name must be added' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'e-mail must be added' })
  @IsEmail()
  email: string;
}
