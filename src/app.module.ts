import { Module } from '@nestjs/common';
import { Product } from './clients/client.entity';
import { ProductService } from './clients/client.service';
import { ProductController } from './clients/client.controller';
import { AppController } from './app.controller';
import { User } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHOST,
      port: 5432,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [Product, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User]),
    AuthModule,
  ],
  providers: [ProductService, UsersService],
  controllers: [ProductController, AppController],
})
export class AppModule {}
