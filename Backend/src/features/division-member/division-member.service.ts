import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { Division } from "../division/entities/division.entity";
import { User } from "../user/entities/user.entity";
import { CreateDivisionMemberDto } from "./dto/create-division-member.dto";
import { UpdateDivisionMemberDto } from "./dto/update-division-member.dto";
import { DivisionMember } from "./entities/division-member.entity";

@Injectable()
export class DivisionMemberService {
  constructor(
    @InjectModel(DivisionMember)
    private readonly divisionMemberModel: typeof DivisionMember,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(division: Division, query: any) {
    try {
      const condition = { division_id: division.id };

      const { count, data } = await new QueryBuilderHelper(
        this.divisionMemberModel,
        query,
      )
        .where(condition)
        .options({
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            { model: Division, attributes: ["id", "name"] },
          ],
        })
        .getResult();

      const result = {
        count: count,
        division_members: data,
      };
      return this.response.success(
        result,
        200,
        "Successfully get division members",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(divisionMember: DivisionMember) {
    return this.response.success(
      divisionMember,
      200,
      "Successfully get division member",
    );
  }

  async create(
    division: Division,
    createDivisionMemberDto: CreateDivisionMemberDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const divisionMember = await this.divisionMemberModel.create(
        {
          ...createDivisionMemberDto,
          division_id: division.id,
        },
        { transaction },
      );
      await transaction.commit();
      return this.response.success(
        { division_member: divisionMember },
        201,
        "Successfully created division member",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    divisionMember: DivisionMember,
    updateDivisionMemberDto: UpdateDivisionMemberDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await divisionMember.update(updateDivisionMemberDto, { transaction });
      await transaction.commit();
      return this.response.success(
        { division_member: divisionMember },
        200,
        "Successfully updated division member",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(divisionMember: DivisionMember) {
    const transaction = await this.sequelize.transaction();
    try {
      await divisionMember.destroy({ transaction });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        "Successfully deleted division member",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
