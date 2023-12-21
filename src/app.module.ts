import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './entity/user';
import { ProductModule } from './product/product.module';
import { Product } from './entity/product';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db/restfulapi.db',
      synchronize: true,
      entities: [User, Product],
    }),
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
