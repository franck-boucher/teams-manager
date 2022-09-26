import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersService } from 'src/users/users.service';
import { TeamsService } from './teams.service';
import {
  CreateTeamInput,
  createTeamSchema,
  UpdateTeamInput,
  updateTeamSchema,
} from './teams.validation';

@Controller('/api/teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getTeams() {
    return this.teamsService.getAll();
  }

  @Get(':id')
  getTeam(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.getById(id);
  }

  @Get(':id/available')
  getAvailableUsers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getAvailableUsersForTeam(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTeamSchema))
  createTeam(@Body() team: CreateTeamInput) {
    return this.teamsService.create(team);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateTeamSchema))
  updateTeam(@Body() team: UpdateTeamInput) {
    return this.teamsService.update(team);
  }

  @Delete(':id')
  deleteTeam(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.delete(id);
  }
}
