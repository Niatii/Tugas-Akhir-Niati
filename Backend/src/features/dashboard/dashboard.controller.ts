import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminDashboard(@CurrentUser() user: any) {
    return this.dashboardService.getAdminDashboard(user);
  }
}
