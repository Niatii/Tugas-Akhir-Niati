import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }
}
