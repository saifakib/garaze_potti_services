import { Module } from '@nestjs/common';
import { RolesModule } from '@/access-control/roles/roles.module';
import { PermissionsModule } from '@/access-control/permissions/permissions.module';

@Module({
  imports: [RolesModule, PermissionsModule],
  controllers: [],
  providers: [],
})
export class AccessControlModule {}
