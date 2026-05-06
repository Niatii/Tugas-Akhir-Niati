import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { RegisterOrganizationDto } from './dto/create-admin.dto';
import { registerSchema } from './validations/requests/register.request';
import { registerOrgSchema } from './validations/requests/registrasi-admin';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register-panitia')
  registerUser(
    @Body(new JoiValidationPipe(registerSchema))
    dto: RegisterUserDto,
  ) {
    return this.authService.registerUser(dto);
  }

  @Post('register-organisasi')
  registerOrg(
    @Body(new JoiValidationPipe(registerOrgSchema))
    dto: RegisterOrganizationDto,
  ) {
    return this.authService.registerOrganization(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user) {
    return this.authService.profile(user);
  }
}