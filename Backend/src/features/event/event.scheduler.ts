import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectModel } from '@nestjs/sequelize'

import { Event } from './entities/event.entity'
import EventStatusEnum from './enums/event-status.enum'

@Injectable()
export class EventScheduler {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
  ) {}

  private calculateStatus(event: Event): number {
    const now = new Date()

    if (event.status === EventStatusEnum.DRAFT) {
      return EventStatusEnum.DRAFT
    }

    if (now < new Date(event.registration_start)) {
      return EventStatusEnum.UPCOMING
    }

    if (now <= new Date(event.registration_end)) {
      return EventStatusEnum.REGISTRATION_OPEN
    }

    if (now < new Date(event.start_date)) {
      return EventStatusEnum.REGISTRATION_CLOSED
    }

    if (now <= new Date(event.end_date)) {
      return EventStatusEnum.ONGOING
    }

    return EventStatusEnum.COMPLETED
  }

  /**
   * setiap 1 menit
   */
  @Cron('*/1 * * * *')
  async handleEventStatusUpdate() {
    const events = await this.eventModel.findAll()

    for (const event of events) {
      const newStatus = this.calculateStatus(event)

      if (event.status !== newStatus) {
        await event.update({
          status: newStatus,
        })

        console.log(
          `[EVENT STATUS UPDATED] Event ${event.id} -> ${newStatus}`,
        )
      }
    }
  }
}