import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { PackagesModule } from './packages/packages.module';
import { ToursModule } from './tours/tours.module';
import { GalleryModule } from './gallery/gallery.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContactsModule } from './contacts/contacts.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AuditModule } from './audit/audit.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CustomBlogsModule } from './custom-blogs/custom-blogs.module';
import { RecommendedVehiclesModule } from './recommended-vehicles/recommended-vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    BookingsModule,
    PackagesModule,
    ToursModule,
    GalleryModule,
    DashboardModule,
    ContactsModule,
    InvoicesModule,
    AuditModule,
    UsersModule,
    SettingsModule,
    ReviewsModule,
    CustomBlogsModule,
    RecommendedVehiclesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
